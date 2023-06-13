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
    }
  }
  Group.init({
    organizerId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    about: DataTypes.STRING,
    type: DataTypes.INTEGER,
    private: DataTypes.BOOLEAN,
    city: DataTypes.STRING,
    state: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};
