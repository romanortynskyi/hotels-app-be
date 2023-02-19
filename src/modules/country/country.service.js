const { Country } = require('~/models')
const { COUNTRY_NOT_FOUND } = require('~/consts/errors')

const countryService = {
  addCountry: async (data) => {
    const country = await Country.create(data)

    return country
  },

  getAllCountries: async () => {
    const countries = await Country.findAll()

    return countries
  },

  getCountryById: async (id) => {
    const country = await Country.findOne({
      where: {
        id,
      },
    })

    if (!country) {
      throw createError(COUNTRY_NOT_FOUND)
    }

    return country
  },

  updateCountry: async (id, data) => {
    const country = await Country.findOne({
      where: {
        id,
      },
    })

    if (!country) {
      throw createError(COUNTRY_NOT_FOUND)
    }

    const { name } = data

    const updateResult = await Country.update(
      {
        name,
      },
      {
        where: {
          id,
        },
        returning: true,
      }
    )

    const updatedCountry = updateResult[1][0].dataValues

    return updatedCountry
  },

  deleteCountry: async (id) => {
    const country = await Country.findOne({
      where: {
        id,
      },
    })

    if (!country) {
      throw createError(COUNTRY_NOT_FOUND)
    }

    await Country.destroy({
      where: {
        id,
      },
    })
  },
}

module.exports = countryService
