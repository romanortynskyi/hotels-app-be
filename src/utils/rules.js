const { rule, and } = require('graphql-shield')
const Joi = require('joi')

const idValidator = require('~/validators/id.validator')
const { UNAUTHORIZED, FORBIDDEN } = require('~/consts/errors')
const createError = require('./create-error')

const dataValidation = (key, validationSchema) =>
  rule()((_, args) => {
    try {
      Joi.assert(args[key], validationSchema)

      return true
    }

    catch(e) {
      return createError({
        code: 'VALIDATION_ERROR',
        message: e.details[0].message,
      })
    }
  })

const idValidation = dataValidation('id', idValidator)

const inputValidation = (validationSchema) => dataValidation('input', validationSchema)

const isAuthorized = rule()((_, __, context) => context.user ? true : createError(UNAUTHORIZED))

const hasRoles = roles =>
  and(
    isAuthorized,
    rule()((_, __, context) => roles.includes(context.user.role) ? true : createError(FORBIDDEN)),
  ) 

module.exports = {
  isAuthorized,
  dataValidation,
  inputValidation,
  idValidation,
  hasRoles,
}