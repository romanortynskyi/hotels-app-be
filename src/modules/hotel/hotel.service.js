const { QueryTypes } = require('sequelize')

const { City, Image, Hotel } = require('~/models')
const {
  CITY_NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  HOTEL_NOT_FOUND,
} = require('~/consts/errors')
const createError = require('~/utils/create-error')
const sequelize = require('~/sequelize')
const uploadService = require('~/modules/upload/upload.service')
const { HOTEL_IMAGES } = require('~/consts')

const hotelService = {
  addHotel: async (data, image) => {
    const {
      name,
      description,
      cityId,
    } = data

    const city = await City.findOne({
      where: {
        id: cityId,
      },
    })

    if (!city) {
      throw createError(CITY_NOT_FOUND)
    }

    const transaction = await sequelize.transaction()

    const imageResponse = await uploadService.uploadFile(image.file, HOTEL_IMAGES)

    try {
      const hotelImage = await Image.create(imageResponse, { transaction })

      const hotel = await Hotel.create({
        name,
        description,
        CityId: cityId,
        ImageId: hotelImage.id,
      }, { transaction })

      const hotelToSend = {
        ...hotel.dataValues,
        image: hotelImage.dataValues,
        city: {
          ...city.dataValues,
          countryId: city.CountryId,
        },
      }

      await transaction.commit()

      return hotelToSend
    }

    catch(error) {
      await transaction.rollback()
      throw createError(INTERNAL_SERVER_ERROR)
    }
  },

  getAllHotels: async (skip, limit, filter) => {
    if (filter) {
      const {
        cityId,
        kidsCount,
        adultsCount,
        startDate,
        endDate,
      } = filter
  
      const city = await City.findOne({
        where: {
          id: cityId,
        },
      })
  
      if (!city) {
        throw createError(CITY_NOT_FOUND)
      }
  
      const hotels = await sequelize.query(
        `
          SELECT
          COUNT(*) OVER() as "totalCount",
          "image"."filename" AS "image.filename",
          "image"."src" AS "image.src",
          "hotel"."id" AS id,
          "hotel"."name" AS name,
          "hotel"."description" AS description,
          MIN("room"."kidPrice") AS "minKidPrice",
          MIN("room"."adultPrice") AS "minAdultPrice"
          FROM "Hotels" "hotel"
          LEFT JOIN "Rooms" "room" ON "room"."HotelId"="hotel"."id"
          LEFT JOIN "Cities" "city" ON "city"."id"="hotel"."CityId"
          LEFT JOIN "Images" "image" ON "image"."id"="hotel"."ImageId"
          WHERE "city"."id" = :cityId
          AND "room"."id" NOT IN (
            SELECT
              "room"."id"
            FROM "Rooms" "room"
            LEFT JOIN "Reservations" "reservation" ON "reservation"."RoomId"="room"."id"
            WHERE "room"."bedsCount" >= :bedsCount
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
            GROUP BY "room"."id"
          )
          GROUP BY "hotel"."id", "image"."id"
          OFFSET :skip
          LIMIT :limit
        `,
        {
          replacements: {
            cityId,
            bedsCount: kidsCount + adultsCount,
            startDate,
            endDate,
            skip,
            limit,
          },
          nest: true,
          type: QueryTypes.SELECT,
        }
      )
  
      const items = hotels.map((hotel) => ({
        ...hotel,
        city: {
          ...city.dataValues,
          countryId: city.CountryId,
        },
      }))
  
      const totalCount = hotels[0]?.totalCount || 0

      return {
        items,
        totalCount,
        pagesCount: Math.ceil(totalCount / limit),
      }
    }

    else {
      const hotels = await sequelize.query(
        `
          SELECT
          COUNT(*) OVER() as "totalCount",
          "image"."filename" AS "image.filename",
          "image"."src" AS "image.src",
          "hotel"."id" AS id,
          "hotel"."name" AS name,
          "hotel"."description" AS description,
          "city"."id" AS "city.id",
          "city"."name" AS "city.name",
          "city"."CountryId" AS "city.countryId",
          MIN("room"."kidPrice") AS "minKidPrice",
          MIN("room"."adultPrice") AS "minAdultPrice"
          FROM "Hotels" "hotel"
          LEFT JOIN "Cities" "city" ON "city"."id"="hotel"."CityId"
          LEFT JOIN "Images" "image" ON "image"."id"="hotel"."ImageId"
          LEFT JOIN "Rooms" "room" ON "room"."HotelId"="hotel"."id"
          GROUP BY "image"."id", "hotel"."id", "city"."id"
          OFFSET :offset
          LIMIT :limit
        `,
        {
          replacements: {
            offset: skip,
            limit,
          },
          nest: true,
          type: QueryTypes.SELECT,
        },
      )

      const totalCount = hotels[0]?.totalCount || 0

      return {
        items: hotels,
        totalCount,
        pagesCount: Math.ceil(totalCount / limit),
      }
    }
  },

  getHotelById: async (id) => {
    const [hotel] = await sequelize.query(
      `
        SELECT
        "image"."filename" AS "image.filename",
        "image"."src" AS "image.src",
        "hotel"."id" AS id,
        "hotel"."name" AS name,
        "hotel"."description" AS description,
        "city"."id" AS "city.id",
        "city"."name" AS "city.name",
        "city"."CountryId" AS "city.countryId",
        MIN("room"."kidPrice") AS "minKidPrice",
        MIN("room"."adultPrice") AS "minAdultPrice"
        FROM "Hotels" "hotel"
        LEFT JOIN "Cities" "city" ON "city"."id"="hotel"."CityId"
        LEFT JOIN "Images" "image" ON "image"."id"="hotel"."ImageId"
        LEFT JOIN "Rooms" "room" ON "room"."HotelId"="hotel"."id"
        WHERE "hotel"."id" = :id
        GROUP BY "image"."id", "hotel"."id", "city"."id"
      `,
      {
        replacements: {
          id,
        },
        nest: true,
      },
    )

    if (!hotel) {
      throw createError(HOTEL_NOT_FOUND)
    }

    return hotel
  },

  updateHotel: async (id, data, image) => {
    const hotel = await Hotel.findOne({
      where: {
        id,
      },
      include: [
        {
          model: City,
          required: true,
        },
        {
          model: Image,
          required: true,
        },
      ],
    })

    if (!hotel) {
      throw createError(HOTEL_NOT_FOUND)
    }

    const {
      name,
      description,
      cityId,
    } = data

    const city = await City.findOne({
      where: {
        id: cityId,
      },
    })

    if (!city) {
      throw createError(CITY_NOT_FOUND)
    }

    const transaction = await sequelize.transaction()

    try {
      await Hotel.update(
        {
          name,
          description,
          CityId: cityId,
        },
        {
          where: {
            id,
          },
          transaction,
        },
      )

      let imageResponse
  
      if (image) {
        await uploadService.deleteFile(hotel.Image.filename)

        imageResponse = await uploadService.uploadFile(image.file, HOTEL_IMAGES)

        await Image.update(
          imageResponse,
          {
            where: {
              id: hotel.ImageId,
            },
            transaction,
          },
        )

        await transaction.commit()
      }

      else {
        await transaction.commit()
      }

      const updatedHotel = await Hotel.findOne({
        where: {
          id,
        },
        include: [
          {
            model: City,
            required: true,
          },
          {
            model: Image,
            required: true,
          },
        ],
      })

      return {
        ...updatedHotel.dataValues,
        city: {
          ...updatedHotel.City.dataValues,
          countryId: updatedHotel.City.CountryId,
        },
        image: imageResponse ? imageResponse : updatedHotel.Image.dataValues,
      }
    }

    catch(error) {
      await transaction.rollback()
      throw createError(INTERNAL_SERVER_ERROR)
    }
  },

  deleteHotel: async (id) => {
    const hotel = await Hotel.findOne({
      where: {
        id,
      },
      include: Image,
    })

    if (!hotel) {
      throw createError(HOTEL_NOT_FOUND)
    }

    await uploadService.deleteFile(hotel.Image.filename)

    const transaction = await sequelize.transaction()

    try {
      await Hotel.destroy({
        where: {
          id,
        },
        transaction,
      })

      await Image.destroy({
        where: {
          id: hotel.ImageId,
        },
        transaction,
      })

      await transaction.commit()

      return hotel.dataValues
    }

    catch(error) {
      await transaction.rollback()
      throw createError(INTERNAL_SERVER_ERROR)
    }
  },
}

module.exports = hotelService
