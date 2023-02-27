const setupServer = require('~/setup-server')
const db = require('~/models')

const setupApp = async () => {
  const setup = await setupServer()
  await db.sequelize.sync({ force: true })

  return setup
}

module.exports = setupApp
