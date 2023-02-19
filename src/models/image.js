'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    static associate(models) {
      Image.hasOne(models.User)
    }
  }

  Image.init({
    src: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Image',
  })

  return Image
}
