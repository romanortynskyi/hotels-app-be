'use strict'
const { Model } = require('sequelize')

const { ROLE_ENUM } = require('~/consts/enums')
const { USER } = require('~/consts')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Image)
      User.hasMany(models.Reservation)
    }
  }

  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(...ROLE_ENUM),
      defaultValue: USER,
    },
    recoveryCode: {
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
    modelName: 'User',
    defaultScope: {
      attributes: {
        exclude: ['password', 'recoveryCode'],
      },
    },
  })

  return User
}
