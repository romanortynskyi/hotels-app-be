const cityType = `#graphql
  type City {
    id: Int!
    name: String!
    country: Country!
  }
`

const cityInput = `#graphql
  input CityInput {
    name: String!
    countryId: Int!
  }
`

const cityQueries = `#graphql
  getAllCities: [City!]!
`

const cityMutations = `#graphql
  addCity(input: CityInput!): City!
  updateCity(id: Int!, input: CityInput!): City!
  deleteCity(id: Int!): City
`

module.exports = {
  cityType,
  cityInput,
  cityQueries,
  cityMutations,
}
