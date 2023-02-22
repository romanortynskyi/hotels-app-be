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
      }
    }
  }
`

module.exports = {
  signUp,
}
