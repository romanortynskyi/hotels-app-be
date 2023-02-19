'use strict'

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Hotels',
      'ImageId',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'Images',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Hotels',
      'ImageId',
    )
  }
}
