const db = require('~/models')

const dbCleanup = async () => {
  await db.sequelize.sync({ force: true })
}

module.exports = dbCleanup
