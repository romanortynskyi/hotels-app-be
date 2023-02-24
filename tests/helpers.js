const expectError = (response, error) => {
  expect(response.body.errors[0].message).toEqual(error.message)
  expect(response.body.errors[0].extensions.code).toEqual(error.code)
}

module.exports = {
  expectError,
}
