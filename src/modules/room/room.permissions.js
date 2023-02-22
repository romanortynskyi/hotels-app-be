const { and, allow } = require('graphql-shield')

const { ADMIN } = require('~/consts')
const { hasRoles, inputValidation, idValidation } = require('~/utils/rules')
const { addRoomValidator } = require('~/validators/room.validator')

const roomQueryPermissions = {
  getRoomById: idValidation,
  getRoomsByHotel: idValidation,
}

const roomMutationPermissions = {
  addRoom: and(hasRoles([ADMIN]), inputValidation(addRoomValidator)),
}

module.exports = {
  roomQueryPermissions,
  roomMutationPermissions,
}
