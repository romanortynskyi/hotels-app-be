const userType = `#graphql
  type User {
    id: Int!
    firstName: String!
    lastName: String!
    email: String!
    role: String!
    token: String
    image: Image
  }
`

const userInput = `#graphql
  input UserInput {
    firstName: String
    lastName: String
    password: String
    email: String
  }
`

const sendResetPasswordEmailInput = `#graphql
  input SendResetPasswordEmailInput {
    email: String
    language: String
  }
`

const verifyRecoveryCodeInput = `#graphql
  input VerifyRecoveryCodeInput {
    email: String
    recoveryCode: String
  }
`

const resetPasswordInput = `#graphql
  input ResetPasswordInput {
    email: String
    recoveryCode: String
    password: String
  }
`

const userQueries = `#graphql
  getMe: User
  verifyRecoveryCode(input: VerifyRecoveryCodeInput!): Boolean
  userExistsByEmail(email: String!): Boolean
`

const userMutations = `#graphql
  signUp(input: UserInput!, image: Upload): User!
  login(input: UserInput!): User!
  sendResetPasswordEmail(input: SendResetPasswordEmailInput!): Boolean!
  resetPassword(input: ResetPasswordInput!): Boolean!
  updateUser(id: Int!, input: UserInput!, shouldDeleteImage: Boolean, image: Upload): User!
  deleteUser(id: Int!): User
`

module.exports = {
  userType,
  userInput,
  sendResetPasswordEmailInput,
  verifyRecoveryCodeInput,
  resetPasswordInput,
  userQueries,
  userMutations,
}
