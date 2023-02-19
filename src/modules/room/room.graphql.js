const roomType = `#graphql
  type Room {
    id: Int!
    number: Int!
    bedsCount: Int!
    kidPrice: Float!
    adultPrice: Float!
    totalPrice: Float
    hotel: Hotel!
  }
`

const roomInput = `#graphql
  input RoomInput {
    number: Int
    bedsCount: Int
    kidPrice: Float
    adultPrice: Float
    hotelId: Int
  }
`

const roomQueries = `#graphql
  getRoomsByHotel(
    id: Int!,
    filter: RoomFilter,
    skip: Int!
    limit: Int!
  ): PaginatedRooms!
  getRoomById(id: Int!): Room!
`

const roomMutations = `#graphql
  addRoom(input: RoomInput!): Room!
`

module.exports = {
  roomType,
  roomInput,
  roomQueries,
  roomMutations,
}
