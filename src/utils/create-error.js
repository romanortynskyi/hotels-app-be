const { GraphQLError } = require('graphql')

const createError = (error) => new GraphQLError(error.message, {
  extensions: {
    code: error.code,
  },
})

module.exports = createError
