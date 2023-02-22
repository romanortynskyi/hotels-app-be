const Joi = require('joi')

const idValidator = require('./id.validator')

const addCityValidator = Joi.object({
  countryId: idValidator,
  name: Joi.string().required(),
})

const updateCityValidator = Joi.object({
  countryId: idValidator,
  name: Joi.string().required(),
})

module.exports = {
  addCityValidator,
  updateCityValidator,
}
