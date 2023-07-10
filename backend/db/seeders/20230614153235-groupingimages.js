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
       {
        groupId: 3,
        url: "https://s7d2.scene7.com/is/image/TWCNews/getty_movie_theaterjpg",
        preview: true
       },
       {
        groupId: 4,
        url: "https://media.istockphoto.com/id/1330424071/photo/large-group-of-people-at-a-concert-party.jpg?s=612x612&w=0&k=20&c=LwdiOCBqbfICjQ3j5AzwyugxmfkbyfL3StKEQhtx4hE=",
        preview: true
       },
       {
        groupId: 5,
        url: "https://res.cloudinary.com/highereducation/image/upload/v1533591754/TheBestColleges.org/study-notebooks.jpg",
        preview: true
       },
       {
        groupId: 6,
        url: "https://hips.hearstapps.com/hmg-prod/images/playing-a-board-game-royalty-free-image-1652461701.jpg",
        preview: true
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
     options.tableName = 'GroupImages';
     const Op = Sequelize.Op;
     return queryInterface.bulkDelete(options);
  }
};
