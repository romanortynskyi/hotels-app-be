require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
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

const typeDefs = require('./type-defs')
const resolvers = require('./resolvers')
const userService = require('./modules/user/user.service')
const { PORT } = require('./configs')
const initializeFirebase = require('./initialize-firebase')
const sequelize = require('./sequelize')

const main = async () => {
  const { default: graphqlUploadExpress } = await import('graphql-upload/graphqlUploadExpress.mjs')

  try {
    await sequelize.authenticate()
    console.log('DB connected!')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }

  initializeFirebase()

  const app = express()
  const httpServer = http.createServer(app)
  
  const server = new ApolloServer({
    typeDefs,
    resolvers,
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
      context: ({ req }) => ({
        user: userService.getUserByToken(req.headers.authorization)
      }),
    }),
  )
  
  await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve))
  
  console.log(`🚀 Server ready at http://localhost:4000/`)  
}

main()
