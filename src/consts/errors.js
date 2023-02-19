const USER_ALREADY_EXISTS = {
  code: 'USER_ALREADY_EXISTS',
  message: 'User with the specified email already exists.',
}

const INCORRECT_CREDENTIALS = {
  code: 'INCORRECT_CREDENTIALS',
  message: 'Email or password is incorrect.',
}

const INVALID_TOKEN = {
  code: 'INVALID_TOKEN',
  message: 'Invalid token.',
}

const USER_NOT_FOUND = {
  code: 'USER_NOT_FOUND',
  message: 'User with the specified id does not exist.',
}

const BAD_TOKEN = {
  code: 'BAD_TOKEN',
  message: 'Invalid token.',
}

const INTERNAL_SERVER_ERROR = {
  code: 'INTERNAL_SERVER_ERROR',
  message: 'Internal server error.',
}

const USER_DOES_NOT_HAVE_AN_IMAGE = {
  code: 'USER_DOES_NOT_HAVE_AN_IMAGE',
  message: 'User does not have an image.',
}

const COUNTRY_NOT_FOUND = {
  code: 'COUNTRY_NOT_FOUND',
  message: 'Country with the specified id does not exist.',
}

const CITY_NOT_FOUND = {
  code: 'CITY_NOT_FOUND',
  message: 'City with the specified id does not exist.',
}

const HOTEL_NOT_FOUND = {
  code: 'HOTEL_NOT_FOUND',
  message: 'Hotel with the specified id does not exist.',
}

const ROOM_NOT_FOUND = {
  code: 'ROOM_NOT_FOUND',
  message: 'Room with the specified id does not exist.',
}

module.exports = {
  USER_ALREADY_EXISTS,
  INCORRECT_CREDENTIALS,
  INVALID_TOKEN,
  USER_NOT_FOUND,
  BAD_TOKEN,
  INTERNAL_SERVER_ERROR,
  USER_DOES_NOT_HAVE_AN_IMAGE,
  COUNTRY_NOT_FOUND,
  CITY_NOT_FOUND,
  HOTEL_NOT_FOUND,
  ROOM_NOT_FOUND,
}
