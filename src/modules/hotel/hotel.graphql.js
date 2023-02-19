const hotelType = `#graphql
  type Hotel {
    id: Int!
    name: String!
    description(sentencesCount: Int): String!
    image: Image
    city: City!
    minKidPrice: Float
    minAdultPrice: Float
  }
`

const hotelInput = `#graphql
  input HotelInput {
    name: String
    description: String
    cityId: Int
  }
`

const hotelQueries = `#graphql
  getAllHotels(
    skip: Int!,
    limit: Int!,
    filter: HotelFilter
  ): PaginatedHotels!
  getHotelById(id: Int!): Hotel!
`

const hotelMutations = `#graphql
  addHotel(input: HotelInput!, image: Upload!): Hotel!
  updateHotel(id: Int!, input: HotelInput!, image: Upload): Hotel!
  deleteHotel(id: Int!): Hotel
`

module.exports = {
  hotelType,
  hotelInput,
  hotelQueries,
  hotelMutations,
}
