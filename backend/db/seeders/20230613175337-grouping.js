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
      state: "TX"
       },
       {
        organizerId: 1,
        name: "Movie night",
        about: "Going out to see new movies at the theater with close friends",
        type: "In person",
        private: false,
        city: "Dallas",
        state: "TX"
       },
       {
        organizerId: 3,
        name: "Concerts",
        about: "Buying tickets to go listen to our favorite artists and hear our favorite songs by them",
        type: "In person",
        private: false,
        city: "Los Angeles",
        state: "CA"
       },
       {
        organizerId: 2,
        name: "Study group",
        about: "Me and the groups thursday night study session before test on friday",
        type: "Online",
        private: true,
        city: "Dallas",
        state: "TX"
       },
       {
        organizerId: 1,
        name: "Game night",
        about: "Watching the game with friends or family that want to come and hangout",
        type: "In person",
        private: true,
        city: "Denver",
        state: "CO"
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
     options.tableName = 'Groups';
     const Op = Sequelize.Op;
     return queryInterface.bulkDelete(options);
  }
};
