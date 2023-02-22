const { and, allow } = require('graphql-shield')

const { ADMIN } = require('~/consts')
const { hasRoles, inputValidation, idValidation } = require('~/utils/rules')
const { addCityValidator, updateCityValidator } = require('~/validators/city.validator')

const cityQueryPermissions = {
  getAllCities: allow,
}

const cityMutationPermissions = {
  addCity: and(hasRoles([ADMIN]), inputValidation(addCityValidator)),
  updateCity: and(hasRoles([ADMIN]), idValidation, inputValidation(updateCityValidator)),
  deleteCity: and(hasRoles([ADMIN]), idValidation),
}

module.exports = {
  cityQueryPermissions,
  cityMutationPermissions,
}
