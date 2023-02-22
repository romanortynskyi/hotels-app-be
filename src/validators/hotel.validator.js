const Joi = require('joi')

const idValidator = require('./id.validator')

const addHotelValidator = Joi.object({
  cityId: idValidator,
  name: Joi.string().required(),
  description: Joi.string().required(),
})

const updateHotelValidator = Joi.object({
  cityId: idValidator,
  name: Joi.string().required(),
  description: Joi.string().required(),
})

module.exports = {
  addHotelValidator,
  updateHotelValidator,
}
