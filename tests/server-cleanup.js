const serverCleanup = async (server) => {
  await server.close()
}

module.exports = serverCleanup
