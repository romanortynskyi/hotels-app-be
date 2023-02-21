const Joi = require('joi')

const idValidator = Joi.number().integer().required()

module.exports = idValidator
