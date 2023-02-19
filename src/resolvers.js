const { userMutation, userQuery } = require('./modules/user/user.resolver')
const { countryQuery, countryMutation } = require('./modules/country/country.resolver')
const { cityQuery, cityMutation } = require('./modules/city/city.resolver')
const { hotelQuery, hotelMutation } = require('./modules/hotel/hotel.resolver')
const { roomQuery, roomMutation } = require('./modules/room/room.resolver')
const { reservationQuery, reservationMutation } = require('./modules/reservation/reservation.resolver')

const countryService = require('./modules/country/country.service')
const userService = require('./modules/user/user.service')
const roomService = require('./modules/room/room.service')
const hotelService = require('./modules/hotel/hotel.service')

const resolvers = {
  Query: {
    ...userQuery,
    ...countryQuery,
    ...cityQuery,
    ...hotelQuery,
    ...roomQuery,
    ...reservationQuery,
  },
  Mutation: {
    ...userMutation,
    ...countryMutation,
    ...cityMutation,
    ...hotelMutation,
    ...roomMutation,
    ...reservationMutation,
  },
  City: {
    country: (parent) => countryService.getCountryById(parent.countryId),
  },
  Reservation: {
    user: (parent) => userService.getUserById(parent.userId),
    room: (parent) => roomService.getRoomById(parent.roomId),
  },
  Hotel: {
    description: (parent, args) => {
      const { sentencesCount } = args;

      const sentences = parent.description.split('.');

      const joinedStr = sentences
        .slice(0, sentencesCount)
        .join('. ')
        .trim();

      const result = `${joinedStr}.`;

      return result;
    },
  },
  Room: {
    hotel: (parent) => hotelService.getHotelById(parent.hotelId),
  },
}

module.exports = resolvers
