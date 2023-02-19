const { City, Country } = require('~/models')
const { CITY_NOT_FOUND, COUNTRY_NOT_FOUND } = require('~/consts/errors')
const createError = require('~/utils/create-error')

const cityService = {
  addCity: async (data) => {
    const { name, countryId } = data

    const country = await Country.findOne({
      where: {
        id: countryId,
      },
    })

    if (!country) {
      throw createError(COUNTRY_NOT_FOUND)
    }

    const city = await City.create({
      name,
      CountryId: countryId,
    })

    const cityToSend = {
      ...city.dataValues,
      countryId,
    }

    return cityToSend
  },

  getAllCities: async () => {
    const cities = await City.findAll()

    const citiesToSend = cities.map((city) => ({
      ...city.dataValues,
      countryId: city.CountryId,
    }))

    return citiesToSend
  },

  updateCity: async (id, data) => {
    const city = await City.findOne({
      where: {
        id,
      },
    })

    if (!city) {
      throw createError(CITY_NOT_FOUND)
    }

    const { name, countryId } = data

    const updateResult = await City.update(
      {
        name,
        CountryId: countryId,
      },
      {
        where: {
          id,
        },
        returning: true,
      }
    )

    const updatedCity = updateResult[1][0].dataValues

    const cityToSend = {
      ...updatedCity,
      countryId,
    }

    return cityToSend
  },

  deleteCity: async (id) => {
    const city = await City.findOne({
      where: {
        id,
      },
    })

    if (!city) {
      throw createError(CITY_NOT_FOUND)
    }

    await City.destroy({
      where: {
        id,
      },
    })
  },
}

module.exports = cityService
