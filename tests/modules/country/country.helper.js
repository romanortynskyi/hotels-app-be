const addCountry = `#graphql
  mutation ADD_COUNTRY($input: CountryInput!) {
    addCountry(input: $input) {
      id
      name
    }
  }
`

const updateCountry = `#graphql
  mutation UPDATE_COUNTRY($id: Int!, $input: CountryInput!) {
    updateCountry(id: $id, input: $input) {
      id
      name
    }
  }
`

const deleteCountry = `#graphql
  mutation DELETE_COUNTRY($id: Int!) {
    deleteCountry(id: $id) {
      id
    }
  }
`

const getAllCountries = `#graphql
  query GET_ALL_COUNTRIES {
    getAllCountries {
      id
      name
    }
  }
`

module.exports = {
  addCountry,
  updateCountry,
  deleteCountry,
  getAllCountries,
}
