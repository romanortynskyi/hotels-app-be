const Joi = require('joi')

const idValidator = require('./id.validator')

const signUpValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().min(1).required(),
  lastName: Joi.string().min(1).required(),
})

const loginValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
})

const updateUserValidator = Joi.object({
  firstName: Joi.string().min(1).required(),
  lastName: Joi.string().min(1).required(),
})

module.exports = {
  signUpValidator,
  loginValidator,
  updateUserValidator,
}
