const reservationType = `#graphql
  type Reservation {
    id: Int!
    user: User
    phoneNumber: String!
    email: String!
    firstName: String!
    lastName: String!
    room: Room!
    startDate: String!
    endDate: String!
    kidsCount: Int!
    adultsCount: Int!
    adultPrice: Int!
    kidPrice: Int!
  }
`

const reservationInput = `#graphql
  input ReservationInput {
    userId: Int
    phoneNumber: String!
    email: String!
    firstName: String!
    lastName: String!
    roomId: Int!
    startDate: String!
    endDate: String!
    kidsCount: Int!
    adultsCount: Int!
  }
`

const reservationQueries = `#graphql
  getReservationsByUser(id: Int!): [Reservation!]!
`

const reservationMutations = `#graphql
  addReservation(input: ReservationInput!): Reservation!
`

module.exports = {
  reservationType,
  reservationInput,
  reservationQueries,
  reservationMutations,
}
