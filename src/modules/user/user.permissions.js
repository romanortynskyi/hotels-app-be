const { and } = require('graphql-shield')

const { USER, ADMIN } = require('~/consts')
const {
  isAuthorized,
  hasRoles,
  inputValidation,
  idValidation,
} = require('~/utils/rules')
const {
  signUpValidator,
  loginValidator,
  updateUserValidator,
} = require('~/validators/user.validator')

const userQueryPermissions = {
  getMe: isAuthorized,
}

const userMutationPermissions = {
  signUp: inputValidation(signUpValidator),
  login: inputValidation(loginValidator),
  updateUser: and(isAuthorized, idValidation, inputValidation(updateUserValidator)),
  deleteUser: and(hasRoles([USER, ADMIN]), idValidation),
}

module.exports = {
  userQueryPermissions,
  userMutationPermissions,
}
