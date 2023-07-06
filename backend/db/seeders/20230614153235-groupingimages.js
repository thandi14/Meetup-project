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
         url: "https://media.istockphoto.com/id/817164728/photo/tennis-players-playing-a-match-on-the-court.jpg?s=612x612&w=0&k=20&c=FU20TqadXiFLCQjw_WHDT3aNMDUdBBZYzIvxegz4X6Y=",
         preview: true
       },
       {
        groupId: 2,
         url: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZGluaW5nJTIwb3V0fGVufDB8fDB8fHww&w=1000&q=80",
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
