const cityService = require('./city.service')

const cityQuery = {
  getAllCities: () => cityService.getAllCities(),
}

const cityMutation = {
  addCity: (_, args) => cityService.addCity(args.input),
  updateCity: (_, args) => cityService.updateCity(args.id, args.input),
  deleteCity: (_, args) => cityService.deleteCity(args.id),
}

module.exports = {
  cityQuery,
  cityMutation,
}
