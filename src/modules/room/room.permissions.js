const { and, allow } = require('graphql-shield')

const { ADMIN } = require('~/consts')
const { hasRoles, inputValidation, idValidation } = require('~/utils/rules')
const { addRoomValidator, updateRoomValidator } = require('~/validators/room.validator')

const roomQueryPermissions = {
  getRoomById: idValidation,
  getRoomsByHotel: idValidation,
}

const roomMutationPermissions = {
  addRoom: and(hasRoles([ADMIN]), inputValidation(addRoomValidator)),
  updateRoom: and(hasRoles([ADMIN]), idValidation, inputValidation(updateRoomValidator)),
}

module.exports = {
  roomQueryPermissions,
  roomMutationPermissions,
}
