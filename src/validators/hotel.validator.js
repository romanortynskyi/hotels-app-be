const Joi = require('joi')

const addHotelValidator = Joi.object({
  cityId: Joi.number().integer().min(1).required(),
  name: Joi.string().required(),
  description: Joi.string().required(),
})

const updateHotelValidator = Joi.object({
  cityId: Joi.number().integer().min(1).required(),
  name: Joi.string().required(),
  description: Joi.string().required(),
})

module.exports = {
  addHotelValidator,
  updateHotelValidator,
}
