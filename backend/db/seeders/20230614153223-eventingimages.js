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
     options.tableName = 'EventImages';
     return queryInterface.bulkInsert(options, [
       {
         eventId: 1,
         url: "https://www.foodandwine.com/thmb/aTb5SZ00S5WOMH92Hu_rHQ9Ebnw=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Web_4000-Hungryroot-Feta-Turkey-Burger-with-Sweet-Potato-06-c70ca047123b4ae8b2045dca0f5b4c39.jpg",
         preview: true
       },
       {
        eventId: 2,
         url: "https://snworksceo.imgix.net/dpn/c1f08449-d72c-493d-97aa-b5707f596399.sized-1000x1000.jpg?w=1000",
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
     options.tableName = 'EventImages';
     const Op = Sequelize.Op;
     return queryInterface.bulkDelete(options);
  }
};
