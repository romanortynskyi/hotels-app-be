const { and } = require('graphql-shield')

const { ADMIN } = require('~/consts')
const { hasRoles, inputValidation, idValidation } = require('~/utils/rules')
const { addCountryValidator, updateCountryValidator } = require('~/validators/country.validator')

const countryQueryPermissions = {
  getAllCountries: hasRoles([ADMIN]),
}

const countryMutationPermissions = {
  addCountry: and(hasRoles([ADMIN]), inputValidation(addCountryValidator)),
  updateCountry: and(hasRoles([ADMIN]), inputValidation(updateCountryValidator)),
  deleteCountry: and(hasRoles([ADMIN]), idValidation),
}

module.exports = {
  countryQueryPermissions,
  countryMutationPermissions,
}
