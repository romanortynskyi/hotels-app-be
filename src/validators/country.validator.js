const Joi = require('joi')

const addCountryValidator = Joi.object({
  name: Joi.string().required(),
})

const updateCountryValidator = Joi.object({
  name: Joi.string().required(),
})

module.exports = {
  addCountryValidator,
  updateCountryValidator,
}
