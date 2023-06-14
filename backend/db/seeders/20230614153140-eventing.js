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
         type: 'In Person',
         capacity: 6,
         price: 300
       },
       {
        venueId: 1,
        groupId: 1,
        name: 'Tennis Group First Meet and Greet',
        description: 'Zoom meeting with tennis group about upcoming game',
        type: 'Online',
        capacity: 8,
        price: 50
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
    options.tableName = 'Events';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Tennis Group First Meet and Greet', 'Brunch'] }
    }, {});
  }
};
