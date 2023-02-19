const countryService = require('./country.service')

const countryQuery = {
  getAllCountries: () => countryService.getAllCountries(),
}

const countryMutation = {
  addCountry: (_, args) => countryService.addCountry(args.input),
  updateCountry: (_, args) => countryService.updateCountry(args.id, args.input),
  deleteCountry: (_, args) => countryService.deleteCountry(args.id),
}

module.exports = {
  countryQuery,
  countryMutation,
}
