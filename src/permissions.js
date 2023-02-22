const { shield } = require('graphql-shield')

const { countryQueryPermissions, countryMutationPermissions } = require('./modules/country/country.permissions')
const { cityQueryPermissions, cityMutationPermissions } = require('./modules/city/city.permissions')
const { hotelQueryPermissions, hotelMutationPermissions } = require('./modules/hotel/hotel.permissions')
const { reservationQueryPermissions, reservationMutationPermissions } = require('./modules/reservation/reservation.permissions')

const permissions = shield({
  Query: {
    ...countryQueryPermissions,
    ...cityQueryPermissions,
    ...hotelQueryPermissions,
    ...reservationQueryPermissions,
  },
  Mutation: {
    ...countryMutationPermissions,
    ...cityMutationPermissions,
    ...hotelMutationPermissions,
    ...reservationMutationPermissions,
  },
}, { allowExternalErrors: true })

module.exports = permissions
