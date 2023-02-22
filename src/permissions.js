const { shield } = require('graphql-shield')

const { countryQueryPermissions, countryMutationPermissions } = require('./modules/country/country.permissions')
const { cityQueryPermissions, cityMutationPermissions } = require('./modules/city/city.permissions')

const permissions = shield({
  Query: {
    ...countryQueryPermissions,
    ...cityQueryPermissions,
  },
  Mutation: {
    ...countryMutationPermissions,
    ...cityMutationPermissions,
  },
})

module.exports = permissions
