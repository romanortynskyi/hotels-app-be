const userService = require('./user.service')

const userQuery = {
  getMe: (_, __, context) => context.user,
}

const userMutation = {
  signUp: (_, args) => userService.signUp(args.input, args.image),
  login: (_, args) => userService.login(args.input),
  updateUser: (_, args) => userService.updateUser(args.id, args.input),
  updateUserImage: (_, args) => userService.updateUserImage(args.id, args.image),
  deleteUserImage: (_, args) => userService.deleteUserImage(args.id),
  deleteUser: (_, args) => userService.deleteUser(args.id),
}

module.exports = {
  userQuery,
  userMutation,
}
