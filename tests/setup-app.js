const setupServer = require('~/setup-server')
const db = require('~/models')

const setupApp = async () => {
  const port = 0
  try {
    const setup = await setupServer(port)
    await db.sequelize.sync({ force:true })

    return setup
  }
  catch(error) {
    console.error(error)
  }
}

module.exports = setupApp
