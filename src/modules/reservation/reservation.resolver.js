const reservationService = require('./reservation.service')

const reservationQuery = {
  getReservationsByUser: (_, args) => reservationService.getReservationsByUser(args.id),
}

const reservationMutation = {
  addReservation: (_, args) => reservationService.addReservation(args.input),
}

module.exports = {
  reservationQuery,
  reservationMutation,
}
