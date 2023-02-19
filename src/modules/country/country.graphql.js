const countryType = `#graphql
  type Country {
    id: Int!
    name: String!
  }
`

const countryInput = `#graphql
  input CountryInput {
    name: String!
  }
`

const countryQueries = `#graphql
  getAllCountries: [Country!]!
`

const countryMutations = `#graphql
  addCountry(input: CountryInput!): Country!
  updateCountry(id: Int!, input: CountryInput!): Country!
  deleteCountry(id: Int!): Country
`

module.exports = {
  countryType,
  countryInput,
  countryQueries,
  countryMutations,
}
