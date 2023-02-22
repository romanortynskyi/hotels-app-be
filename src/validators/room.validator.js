const Joi = require('joi')

const idValidator = require('./id.validator')

const addRoomValidator = Joi.object({
  number: Joi.number().integer().min(1).required(),
  bedsCount: Joi.number().integer().min(1).required(),
  kidPrice: Joi.number().positive().required(),
  adultPrice: Joi.number().positive().required(),
  hotelId: idValidator,
})

module.exports = {
  addRoomValidator,
}
