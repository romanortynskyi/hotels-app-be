'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Hotel extends Model {
    static associate(models) {
      Hotel.belongsTo(models.Image)
      Hotel.belongsTo(models.City)
      Hotel.hasMany(models.Room)
    }
  }

  Hotel.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Hotel',
  })

  return Hotel
}
