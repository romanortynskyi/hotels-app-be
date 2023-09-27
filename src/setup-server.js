const path = require('path')

const testEnvPath = path.resolve(__dirname, '../.env.test')
const localEnvPath = path.resolve(__dirname, '../.env.local')
require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? testEnvPath : localEnvPath 
})

require('module-alias/register')
require('../module-aliases')

const { ApolloServer } = require('@apollo/server')
const { expressMiddleware } = require('@apollo/server/express4')
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer')
const express = require('express')
const http = require('http')
const cors = require('cors')
const bodyParser = require('body-parser')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const { applyMiddleware } = require('graphql-middleware')

const typeDefs = require('./type-defs')
const resolvers = require('./resolvers')
const permissions = require('./permissions')
const userService = require('./modules/user/user.service')

const sequelize = require('./sequelize')

const setupServer = async (port) => {
  const { default: graphqlUploadExpress } = await import('graphql-upload/graphqlUploadExpress.mjs')

  try {
    await sequelize.authenticate()
    console.log('DB connected!')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }

  const app = express()
  const httpServer = http.createServer(app)
  
  const schema = makeExecutableSchema({ typeDefs, resolvers })

  const schemaWithPermissions = applyMiddleware(schema, permissions)

  const server = new ApolloServer({
    typeDefs,
    schema: schemaWithPermissions,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  })
  
  await server.start()
  
  app.use(graphqlUploadExpress())

  app.use(
    '/',
    cors({
      origin: '*',
    }),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({
        user: await userService.getUserByToken(req.headers.authorization)
      }),
    }),
  )
  
  await new Promise((resolve) => httpServer.listen({ port }, resolve))
  
  const actualPort = httpServer.address().port

  console.log(`🚀 Server ready at http://localhost:${actualPort}`)

  return {
    url: `http://localhost:${actualPort}`,
    server: httpServer,
  }
}

module.exports = setupServer