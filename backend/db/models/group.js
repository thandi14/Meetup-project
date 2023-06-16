'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Group.belongsToMany(
        models.User,
        {
          through: models.Membership,
          foreignKey: 'groupId',
          otherKey: 'userId'
        }
      )
      Group.belongsTo(
        models.User,
        {foreignKey: 'organizerId'}
      )
      Group.belongsToMany(
        models.Venue,
        {
          through: models.Event,
          foreignKey: "groupId",
          otherKey: 'venueId'
        }
      )
      Group.hasMany(
        models.GroupImage,
        {foreignKey: 'groupId'}
      )
      Group.hasMany(
        models.Venue,
        {foreignKey: 'groupId'}
      )
      Group.hasMany(
        models.Event,
        { foreignKey: 'groupId', onDelete: 'CASCADE', hooks: true}
      )
      Group.hasMany(
        models.Membership,
        { foreignKey: 'groupId', onDelete: 'CASCADE', hooks: true}
      )
    }
  }
  Group.init({
    organizerId: DataTypes.INTEGER,
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [0, 60]
      }
    },
    about: {
     type: DataTypes.STRING,
      validate: {
        len: [50, Infinity]
      }
    },
    type: {
      type: DataTypes.ENUM("In person", "Online"),
      allowNull: false
    },
    private:{
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
     type: DataTypes.STRING,
     allowNull: false

    }
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};
