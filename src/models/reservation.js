'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Reservation extends Model {
    static associate(models) {
      Reservation.belongsTo(models.User)
      Reservation.belongsTo(models.Room)
    }
  }

  Reservation.init({
    firstName: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    lastName: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    phoneNumber: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    startDate: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    endDate: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    kidsCount: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    adultsCount: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    adultPrice: {
      allowNull: false,
      type: DataTypes.FLOAT,
    },
    kidPrice: {
      allowNull: false,
      type: DataTypes.FLOAT,
    },
  }, {
    sequelize,
    modelName: 'Reservation',
  })

  return Reservation
}
