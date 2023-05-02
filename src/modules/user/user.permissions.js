const { and, allow } = require('graphql-shield')

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
  sendResetPasswordEmailValidator,
  resetPasswordValidator,
  updateUserValidator,
} = require('~/validators/user.validator')

const userQueryPermissions = {
  getMe: isAuthorized,
  verifyRecoveryCode: allow,
  userExistsByEmail: allow,
}

const userMutationPermissions = {
  signUp: inputValidation(signUpValidator),
  login: inputValidation(loginValidator),
  sendResetPasswordEmail: inputValidation(sendResetPasswordEmailValidator),
  resetPassword: inputValidation(resetPasswordValidator),
  updateUser: and(isAuthorized, idValidation, inputValidation(updateUserValidator)),
  deleteUser: and(hasRoles([USER, ADMIN]), idValidation),
}

module.exports = {
  userQueryPermissions,
  userMutationPermissions,
}
