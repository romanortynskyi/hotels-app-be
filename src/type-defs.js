const {
  userType,
  userInput,
  userQueries,
  userMutations,
} = require('./modules/user/user.graphql')
const {
  countryType,
  countryInput,
  countryQueries,
  countryMutations,
} = require('./modules/country/country.graphql')
const {
  cityType,
  cityInput,
  cityQueries,
  cityMutations,
} = require('./modules/city/city.graphql')
const {
  hotelType,
  hotelInput,
  hotelQueries,
  hotelMutations,
} = require('./modules/hotel/hotel.graphql')
const {
  roomType,
  roomInput,
  roomQueries,
  roomMutations,
} = require('./modules/room/room.graphql')
const {
  reservationType,
  reservationInput,
  reservationQueries,
  reservationMutations,
} = require('./modules/reservation/reservation.graphql')

module.exports = `#graphql
  scalar Upload

  type Image {
    src: String!
    filename: String!
  }

  ${userType}
  ${countryType}
  ${cityType}
  ${hotelType}
  ${roomType}
  ${reservationType}

  ${userInput}
  ${countryInput}
  ${cityInput}
  ${hotelInput}
  ${roomInput}
  ${reservationInput}

  input HotelFilter {
    cityId: Int
    startDate: String!
    endDate: String!
    kidsCount: Int!
    adultsCount: Int!
  }

  input RoomFilter {
    startDate: String!
    endDate: String!
    kidsCount: Int!
    adultsCount: Int!
  }

  type PaginatedHotels {
    items: [Hotel!]!
    totalCount: Int!
    pagesCount: Int!
  }

  type PaginatedRooms {
    items: [Room!]!
    totalCount: Int!
    pagesCount: Int!
  }

  type Query {
    ${userQueries}
    ${countryQueries}
    ${cityQueries}
    ${hotelQueries}
    ${roomQueries}
    ${reservationQueries}
  }

  type Mutation {
    ${userMutations}
    ${countryMutations}
    ${cityMutations}
    ${hotelMutations}
    ${roomMutations}
    ${reservationMutations}
  }
  
`
