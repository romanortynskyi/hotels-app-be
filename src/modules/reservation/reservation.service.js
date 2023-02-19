const { Room, User, Reservation } = require('~/models')
const createError = require('~/utils/create-error')
const { ROOM_NOT_FOUND, USER_NOT_FOUND } = require('~/consts/errors')

const reservationService = {
  addReservation: async (data) => {
    const {
      roomId,
      userId,
      firstName,
      lastName,
      email,
      phoneNumber,
      startDate,
      endDate,
      kidsCount,
      adultsCount,
    } = data

    const room = await Room.findOne({
      where: {
        id: roomId,
      },
    })

    if (!room) {
      throw createError(ROOM_NOT_FOUND)
    }

    if (userId) {
      const user = await User.findOne({
        where: {
          id: userId,
        },
      })

      if (!user) {
        throw createError(USER_NOT_FOUND)
      }
    }

    const reservation = await Reservation.create({
      UserId: userId,
      RoomId: roomId,
      firstName,
      lastName,
      email,
      phoneNumber,
      startDate,
      endDate,
      kidsCount,
      adultsCount,
      adultPrice: room.adultPrice,
      kidPrice: room.kidPrice,
    })

    const reservationToSend = {
      ...reservation.dataValues,
      startDate,
      endDate,
      roomId,
      userId,
    }

    return reservationToSend
  },

  getReservationsByUser: async (id) => {
    const user = await User.findOne({
      where: {
        id,
      },
      include: Reservation,
    })

    if (!user) {
      throw createError(USER_NOT_FOUND)
    }

    const reservationsToSend = user.Reservations.map((reservation) =>({
      ...reservation.dataValues,
      userId: id,
      roomId: reservation.RoomId,
      startDate: reservation.startDate.toISOString(),
      endDate: reservation.endDate.toISOString(),
    }))

    return reservationsToSend
  },
}

module.exports = reservationService
