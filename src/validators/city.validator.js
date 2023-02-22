const Joi = require('joi')

const addCityValidator = Joi.object({
  countryId: Joi.number().integer().min(1).required(),
  name: Joi.string().required(),
})

const updateCityValidator = Joi.object({
  countryId: Joi.number().integer().min(1).required(),
  name: Joi.string().required(),
})

module.exports = {
  addCityValidator,
  updateCityValidator,
}
