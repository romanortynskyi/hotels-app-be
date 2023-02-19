const userType = `#graphql
  type User {
    id: Int!
    firstName: String!
    lastName: String!
    email: String!
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

const userQueries = `#graphql
  getMe: User
`

const userMutations = `#graphql
  signUp(input: UserInput!, image: Upload): User!
  login(input: UserInput!): User!
  updateUser(id: Int!, input: UserInput!): User!
  updateUserImage(id: Int!, image: Upload!): User!
  deleteUserImage(id: Int!): User
  deleteUser(id: Int!): User
`

module.exports = {
  userType,
  userInput,
  userQueries,
  userMutations,
}
