'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    static associate(models) {
      Room.belongsTo(models.Hotel)
      Room.hasMany(models.Reservation)
    }
  }

  Room.init({
    number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    bedsCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    kidPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
      
    },
    adultPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Room',
  })

  return Room
}
