const request = require('supertest')
const bcrypt = require('bcrypt')

const { User } = require('~/models')
const { SALT_ROUNDS } = require('~/consts')
const { UNAUTHORIZED, FORBIDDEN } = require('~/consts/errors')

const setupApp = require('../../setup-app')
const serverCleanup = require('../../server-cleanup')
const {
  addCountry,
  getAllCountries,
} = require('./country.helper')
const { signUp, login } = require('../user/user.helper')
const dbCleanup = require('../../db-cleanup')
const { expectError } = require('../../helpers')
const { testUser, testCountry } = require('../../consts')

describe('user queries', () => {
  let server

  beforeAll(async () => {
    ({ server } = await setupApp())
  })

  beforeEach(async () => {
    await dbCleanup()
  })

  afterAll(async () => {
    await serverCleanup(server)
  })

  describe('getAllCountries', () => {
    it('should get all countries', async () => {
      const admin = await User.create({
        firstName: 'ADMIN',
        lastName: 'ADMIN',
        email: 'admin@example.com',
        password: await bcrypt.hash('password', SALT_ROUNDS),
        role: 'admin',
      })
  
      const loginResponse = await request(server)
        .post('/')
        .send({
          query: login,
          variables: {
            input: {
              email: admin.email,
              password: 'password',
            },
          },
        })
  
      await request(server)
        .post('/')
        .set('Authorization', loginResponse.body.data.login.token)
        .send({
          query: addCountry,
          variables: {
            input: testCountry,
          },
        })

      const getAllCountriesResponse = await request(server)
        .post('/')
        .set('Authorization', loginResponse.body.data.login.token)
        .send({
          query: getAllCountries,
        })

      expect(getAllCountriesResponse.body.data.getAllCountries[0]).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          ...testCountry,
        })
      )
    })

    it('should throw if user is unauthorized', async () => {
      const response = await request(server)
        .post('/')
        .send({
          query: getAllCountries,
        })

      expectError(response, UNAUTHORIZED)
    })

    it('should throw if user is forbidden', async () => {
      const signUpResponse = await request(server)
        .post('/')
        .send({
          query: signUp,
          variables: {
            input: testUser,
          },
        })

      const getAllCountriesResponse = await request(server)
        .post('/')
        .set('Authorization', signUpResponse.body.data.signUp.token)
        .send({
          query: getAllCountries,
        })

      expectError(getAllCountriesResponse, FORBIDDEN)
    })
  })
})
