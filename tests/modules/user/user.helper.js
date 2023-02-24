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

const updateUser = `#graphql
  mutation UPDATE_USER($id: Int!, $input: UserInput!, $shouldDeleteImage: Boolean, $image: Upload) {
    updateUser(id: $id, input: $input,shouldDeleteImage: $shouldDeleteImage, image: $image) {
      id
      firstName
      lastName
      email
      image {
        src
        filename
      }
    }
  }
`

const deleteUser = `#graphql
  mutation DELETE_USER($id: Int!) {
    deleteUser(id: $id) {
      id
    }
  }
`

module.exports = {
  signUp,
  login,
  updateUser,
  deleteUser,
}
