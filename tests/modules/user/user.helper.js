const signUp = `#graphql
  mutation SIGN_UP($input: UserInput!, $image: Upload) {
    signUp(input: $input, image: $image) {
      id
      firstName
      lastName
      email
      token
      image {
        src
        filename
      }
    }
  }
`

const login = `#graphql
  mutation LOGIN($input: UserInput!) {
    login(input: $input) {
      id
      firstName
      lastName
      email
      token
      image {
        src
        filename
      }
    }
  }
`

module.exports = {
  signUp,
  login,
}
