'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
     options.tableName = 'Groups';
     return queryInterface.bulkInsert(options, [
       {
      organizerId: 1,
      name: "Evening Tennis on the Water",
      about: "Enjoy rounds of tennis with a tight-nit group of people on the water facing the Brooklyn Bridge. Singles or doubles.",
      type: "In person",
      private: true,
      city: "New York",
      state: "NY"
       },
       {
      organizerId: 2,
      name: "Brunch at noon at Cheesecake",
      about: "Eat the best dishes around",
      type: "In person",
      private: true,
      city: "Southlake",
      state: "Tx"
       },
     ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     options.tableName = 'Groups';
     const Op = Sequelize.Op;
     return queryInterface.bulkDelete(options, {
       name: { [Op.in]: ['Evening Tennis on the Water', 'Brunch at noon at Cheesecake'] }
     }, {});
  }
};
