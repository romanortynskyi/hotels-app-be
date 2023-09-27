const roomService = require('./room.service')

const roomQuery = {
  getRoomById: (_, args) => roomService.getRoomById(args.id),
  getRoomsByHotel: (_, args) => roomService.getRoomsByHotel(
    args.id,
    args.filter,
    args.skip,
    args.limit,
  ),
}

const roomMutation = {
  addRoom: (_, args) => roomService.addRoom(args.input),
  updateRoom: (_, args) => roomService.updateRoom(args.id, args.input),
}

module.exports = {
  roomQuery,
  roomMutation,
}
