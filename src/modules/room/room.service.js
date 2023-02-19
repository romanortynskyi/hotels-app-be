const { QueryTypes } = require('sequelize')

const { Hotel, Room } = require('~/models')
const {
  ROOM_NOT_FOUND,
  HOTEL_NOT_FOUND,
} = require('~/consts/errors')
const createError = require('~/utils/create-error')
const sequelize = require('~/sequelize')

const roomService = {
  addRoom: async (data) => {
    const {
      number,
      bedsCount,
      kidPrice,
      adultPrice,
      hotelId,
    } = data

    const hotel = await Hotel.findOne({
      where: {
        id: hotelId,
      },
    })

    if (!hotel) {
      throw createError(HOTEL_NOT_FOUND)
    }

    const room = await Room.create({
      number,
      bedsCount,
      kidPrice,
      adultPrice,
      HotelId: hotelId,
    })

    const roomToSend = {
      ...room.dataValues,
      hotelId,
    }

    return roomToSend
  },

  getRoomsByHotel: async (id, filter, skip, limit) => {
    if (filter) {
      const {
        kidsCount,
        adultsCount,
        startDate,
        endDate,
      } = filter

      const rooms = await sequelize.query(
        `
          SELECT
          *,
          COUNT(*) OVER() AS "totalCount",
          "room"."kidPrice" * :kidsCount + "room"."adultPrice" * :adultsCount AS "totalPrice"
          FROM "Rooms" "room"
          WHERE "room"."HotelId" = :hotelId
          AND "room"."id" IN (
            SELECT "reservation"."RoomId" AS "roomId"
            FROM "Reservations" "reservation"
            GROUP BY "roomId"
            HAVING 
            SUM(
              (
                ("startDate" < :startDate AND "endDate" < :startDate)
                OR
                ("startDate" > :endDate AND "endDate" > :endDate)
              )::int
            ) = COUNT(*)
          )
          OFFSET :offset
          LIMIT :limit
        `,
        {
          replacements: {
            hotelId: id,
            offset: skip,
            limit,
            kidsCount,
            adultsCount,
            startDate,
            endDate,
          },
          type: QueryTypes.SELECT,
        },
      )

      const totalCount = rooms[0]?.totalCount || 0

      return {
        items: rooms,
        totalCount,
        pagesCount: Math.ceil(totalCount / limit),
      }
    }

    else {
      const hotel = await Hotel.findOne({
        where: {
          id,
        },
        include: Room,
      })
  
      if (!hotel) {
        throw createError(HOTEL_NOT_FOUND)
      }
  
      const roomsToSend = hotel.Rooms.map((room) => ({
        ...room.dataValues,
        hotelId: room.HotelId,
      }))
  
      return roomsToSend
    }
    
  },

  getRoomById: async (id) => {
    const room = await Room.findOne({
      where: {
        id,
      },
    })

    if (!room) {
      throw createError(ROOM_NOT_FOUND)
    }

    const roomToSend = {
      ...room.dataValues,
      hotelId: room.HotelId,
    }

    return roomToSend
  },

  updateRoom: async (id, data, image) => {
    
  },

  deleteRoom: async (id) => {
    
  },
}

module.exports = roomService
