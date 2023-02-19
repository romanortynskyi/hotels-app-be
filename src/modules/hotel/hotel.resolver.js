const hotelService = require('./hotel.service')

const hotelQuery = {
  getAllHotels: (_, args) => hotelService.getAllHotels(args.skip, args.limit, args.filter),
  getHotelById: (_, args) => hotelService.getHotelById(args.id),
}

const hotelMutation = {
  addHotel: (_, args) => hotelService.addHotel(args.input, args.image),
  updateHotel: (_, args) => hotelService.updateHotel(args.id, args.input, args.image),
  deleteHotel: (_, args) => hotelService.deleteHotel(args.id),
}

module.exports = {
  hotelQuery,
  hotelMutation,
}
