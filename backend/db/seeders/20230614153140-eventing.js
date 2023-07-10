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
     options.tableName = 'Events';
     return queryInterface.bulkInsert(options, [
       {
         venueId: 2,
         groupId: 2,
         name: 'Brunch',
         description: 'Getting togeather with close friends for a bite to eat',
         type: 'In person',
         capacity: 6,
         price: 300,
         startDate: "2021-11-19 20:00:00",
         endDate: "2021-11-19 22:00:00"
       },
       {
        venueId: 1,
        groupId: 1,
        name: 'Tennis Group First Meet and Greet',
        description: 'Zoom meeting with tennis group about upcoming game',
        type: 'Online',
        capacity: 8,
        price: 50,
        startDate: "2021-11-19 20:00:00",
        endDate: "2021-11-19 22:00:00"
       },
       {
        venueId: 3,
        groupId: 4,
        name: "Doja cat tour",
        description: "My favorite rapper/singer is playing this weekend",
        type: "In person",
        capacity: 4,
        price: 250,
        startDate: "2023-09-16 18:30:00",
        endDate: "2023-09-16 20:30:00"
       },
       {
        venueId: 2,
        groupId: 5,
        name: "Algebra",
        description: "Upcoming test this friday on algebra to study with the group for",
        type: "Online",
        capacity: 6,
        price: 0,
        startDate: "2023-07-03 16:00:00",
        endDate: "2023-07-03 17:30:00"
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
    options.tableName = 'Events';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options);
  }
};
