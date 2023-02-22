const Joi = require('joi')

const { PHONE_NUMBER_REGEXP, DATE_REGEXP } = require('~/consts/regexp')
const idValidator = require('./id.validator')

const addReservationValidator = Joi.object({
  roomId: idValidator,
  userId: Joi.number().integer().min(1).optional(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().regex(PHONE_NUMBER_REGEXP).required(),
  startDate: Joi.string().regex(DATE_REGEXP).required(),
  endDate: Joi.string().regex(DATE_REGEXP).required(),
  kidsCount: Joi.number().min(0).required(),
  adultsCount: Joi.number().min(1).required(),
})

module.exports = {
  addReservationValidator,
}
