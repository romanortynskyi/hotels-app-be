const userService = require('./user.service')

const userQuery = {
  getMe: (_, __, context) => context.user,
  verifyRecoveryCode: (_, args) => userService.verifyRecoveryCode(args.input),
  userExistsByEmail: (_, args) => userService.userExistsByEmail(args.email),
}

const userMutation = {
  signUp: (_, args) => userService.signUp(args.input, args.image),
  login: (_, args) => userService.login(args.input),
  sendResetPasswordEmail: (_, args) => userService.sendResetPasswordEmail(args.input),
  resetPassword: (_, args) => userService.resetPassword(args.input),
  updateUser: (_, args) => userService.updateUser(args.id, args.input, args.shouldDeleteImage, args.image),
  deleteUser: (_, args) => userService.deleteUser(args.id),
}

module.exports = {
  userQuery,
  userMutation,
}
