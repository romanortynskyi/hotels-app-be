const { shield } = require('graphql-shield')

const { countryQueryPermissions, countryMutationPermissions } = require('./modules/country/country.permissions')

const permissions = shield({
  Query: {
    ...countryQueryPermissions,
  },
  Mutation: {
    ...countryMutationPermissions,
  },
})

module.exports = permissions
