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
     options.tableName = 'Venues';
     return queryInterface.bulkInsert(options, [
       {
         groupId: 1,
         address: '1234 Baylake Dr',
         city: 'New York',
         state: 'NY',
         lat: 50.12,
         lng: -86.06
       },
       {
        groupId: 2,
        address: '4321 Heartfelt ln',
        city: 'Southlake',
        state: 'TX',
        lat: 40.71,
        lng: -74.00
       },
       {
        groupId: 4,
        address: "4321 Disney ln",
        city: "Los Angeles",
        state: "CA",
        lat: 60.34,
        lng: -33.65
       }
     ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     options.tableName = 'Venues';
     const Op = Sequelize.Op;
     return queryInterface.bulkDelete(options);
  }
};
