const { shield } = require('graphql-shield')

const { countryQueryPermissions, countryMutationPermissions } = require('./modules/country/country.permissions')
const { cityQueryPermissions, cityMutationPermissions } = require('./modules/city/city.permissions')
const { hotelQueryPermissions, hotelMutationPermissions } = require('./modules/hotel/hotel.permissions')

const permissions = shield({
  Query: {
    ...countryQueryPermissions,
    ...cityQueryPermissions,
    ...hotelQueryPermissions,
  },
  Mutation: {
    ...countryMutationPermissions,
    ...cityMutationPermissions,
    ...hotelMutationPermissions,
  },
}, { allowExternalErrors: true })

module.exports = permissions
