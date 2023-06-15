'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Venue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Venue.belongsToMany(
        models.Group,
        {
          through: models.Event,
          foreignKey: "venueId",
          otherKey: 'groupId'
        }
      )
      Venue.belongsTo(
        models.Group,
        {foreignKey: 'groupId'}
      )
      Venue.hasMany(
        models.Event,
        { foreignKey: 'venueId', onDelete: 'CASCADE', hooks: true}
      )
    }
  }
  Venue.init({
    groupId: DataTypes.INTEGER,
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lat: DataTypes.DECIMAL,
    lng: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'Venue',
  });
  return Venue;
};
