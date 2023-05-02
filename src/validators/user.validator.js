const Joi = require('joi')

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

const sendResetPasswordEmailValidator = Joi.object({
  email: Joi.string().email().required(),
  language: Joi.string().length(2).required(),
})

const resetPasswordValidator = Joi.object({
  email: Joi.string().email().required(),
  recoveryCode: Joi.string().regex(/^\d{6}$/).required(),
  password: Joi.string().required(),
})

const updateUserValidator = Joi.object({
  firstName: Joi.string().min(1).required(),
  lastName: Joi.string().min(1).required(),
})

module.exports = {
  signUpValidator,
  loginValidator,
  sendResetPasswordEmailValidator,
  resetPasswordValidator,
  updateUserValidator,
}
