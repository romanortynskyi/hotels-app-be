const { and, allow } = require('graphql-shield')

const { ADMIN } = require('~/consts')
const { hasRoles, inputValidation, idValidation } = require('~/utils/rules')
const { addHotelValidator, updateHotelValidator } = require('~/validators/hotel.validator')

const hotelQueryPermissions = {
  getAllHotels: allow,
  getHotelById: allow,
}

const hotelMutationPermissions = {
  addHotel: and(hasRoles([ADMIN]), inputValidation(addHotelValidator)),
  updateHotel: and(hasRoles([ADMIN]), idValidation, inputValidation(updateHotelValidator)),
  deleteHotel: and(hasRoles([ADMIN]), idValidation),
}

module.exports = {
  hotelQueryPermissions,
  hotelMutationPermissions,
}
