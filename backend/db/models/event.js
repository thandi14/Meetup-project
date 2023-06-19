'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Event.hasMany(
        models.EventImage,
        { foreignKey: 'eventId', onDelete: 'CASCADE', hooks: true}
      )
      Event.belongsToMany(
        models.User,
        {
          through: models.Attendance,
          foreignKey: 'eventId',
          otherKey: 'userId',
          onDelete: 'CASCADE'
        },
      )
      Event.belongsTo(
        models.Venue,
        { foreignKey: 'venueId'}
      )
      Event.belongsTo(
        models.Group,
        { foreignKey: 'groupId'}
      )
      Event.hasMany(
        models.Attendance,
        { foreignKey: 'eventId', onDelete: 'CASCADE', hooks: true}
      )
    }
  }
  Event.init({
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    venueId: DataTypes.INTEGER,
    groupId: DataTypes.INTEGER,
    name: {
     type: DataTypes.STRING,
     validate: {
      len: [5, Infinity]
     }

    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: DataTypes.ENUM("In person", "Online"),
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate:  {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};
