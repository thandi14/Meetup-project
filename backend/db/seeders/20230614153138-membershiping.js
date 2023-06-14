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
     options.tableName = 'Memberships';
     return queryInterface.bulkInsert(options, [
       {
         userId: 2,
         groupId: 1,
         status: "co-host"
       },
       {
        userId: 3,
         groupId: 1,
         status: "member"
       },
       {
        userId: 1,
        groupId: 2,
        status: 'co-host'
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
     options.tableName = 'Memberships';
     const Op = Sequelize.Op;
     return queryInterface.bulkDelete(options);
  }
};
