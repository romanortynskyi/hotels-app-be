const Joi = require('joi')

const idValidator = Joi.number().integer().min(1).required()

module.exports = idValidator
