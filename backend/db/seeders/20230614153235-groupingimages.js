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
     options.tableName = 'GroupImages';
     return queryInterface.bulkInsert(options, [
       {
         groupId: 1,
         url: "https://images.pexels.com/photos/8223959/pexels-photo-8223959.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
         preview: true
       },
       {
        groupId: 2,
         url: "https://static3.depositphotos.com/1003631/209/i/450/depositphotos_2099183-stock-photo-fine-table-setting-in-gourmet.jpg",
         preview: true
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
     options.tableName = 'GroupImages';
     const Op = Sequelize.Op;
     return queryInterface.bulkDelete(options);
  }
};
