const { and } = require('graphql-shield')

const { USER, ADMIN } = require('~/consts')
const { hasRoles, inputValidation, idValidation } = require('~/utils/rules')
const { addReservationValidator } = require('~/validators/reservation.validator')

const reservationQueryPermissions = {
  getReservationsByUser: and(hasRoles([USER, ADMIN]), idValidation),
}

const reservationMutationPermissions = {
  addReservation: and(hasRoles([USER, ADMIN]), inputValidation(addReservationValidator)),
}

module.exports = {
  reservationQueryPermissions,
  reservationMutationPermissions,
}
