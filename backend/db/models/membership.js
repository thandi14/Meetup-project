'use strict';
const { Op } = require('sequelize');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Membership extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Membership.belongsTo(
        models.User,
        { foreignKey: 'userId'}
      )
      Membership.belongsTo(
        models.Group,
        { foreignKey: 'groupId'}
      )
    }
  }
  Membership.init({
    userId: DataTypes.INTEGER,
    groupId: DataTypes.INTEGER,
    status: {
      type: DataTypes.ENUM('co-host', 'member', 'pending'),
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Membership',
      defaultScope: {
          where: {
            status: {
              [Op.in]: ['co-host', 'member', 'pending']
            }
          }

      },
      scopes: {
          organizer: {
            where: {
              status: 'co-host'
            }
          },
          membership: {
            where: {
              status: {
                [Op.in]: ['co-host', 'member']
              }
            }
          },
      }
  });

  return Membership;
};
