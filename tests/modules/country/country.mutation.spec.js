const request = require('supertest')
const bcrypt = require('bcrypt')

const { User } = require('~/models')
const { SALT_ROUNDS } = require('~/consts')
const {
  FORBIDDEN,
  UNAUTHORIZED,
  COUNTRY_NOT_FOUND,
} = require('~/consts/errors')

const setupApp = require('../../setup-app')
const dbCleanup = require('../../db-cleanup')
const serverCleanup = require('../../server-cleanup')
const { login, signUp } = require('../user/user.helper')
const {
  addCountry,
  updateCountry,
  deleteCountry,
} = require('./country.helper')
const { expectError } = require('../../helpers')
const {
  testCountry,
  testUser,
  testUpdateCountry,
} = require('../../consts') 

describe('country mutations', () => {
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

  describe('addCountry', () => {
    it('should add country', async () => {
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
  
      const addCountryResponse = await request(server)
        .post('/')
        .set('Authorization', loginResponse.body.data.login.token)
        .send({
          query: addCountry,
          variables: {
            input: testCountry,
          },
        })
        
      expect(addCountryResponse.body.data.addCountry).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          name: testCountry.name,
        })
      )
    })
  
    it('should throw if user is not authorized', async () => {
      const response = await request(server)
        .post('/')
        .send({
          query: addCountry,
          variables: {
            input: testCountry,
          },
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

      const addCountryResponse = await request(server)
        .post('/')
        .set('Authorization', signUpResponse.body.data.signUp.token)
        .send({
          query: addCountry,
          variables: {
            input: testCountry,
          },
        })

      expectError(addCountryResponse, FORBIDDEN)
    })
  })

  describe('updateCountry', () => {
    it('should update country', async () => {
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

      const addCountryResponse = await request(server)
        .post('/')
        .set('Authorization', loginResponse.body.data.login.token)
        .send({
          query: addCountry,
          variables: {
            input: testCountry,
          },
        })
        
  
      const updateCountryResponse = await request(server)
        .post('/')
        .set('Authorization', loginResponse.body.data.login.token)
        .send({
          query: updateCountry,
          variables: {
            id: addCountryResponse.body.data.addCountry.id,
            input: testUpdateCountry,
          },
        })

      expect(updateCountryResponse.body.data.updateCountry).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          name: testUpdateCountry.name,
        })
      )
    })

    it('should throw if country is not found', async () => {
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
  
      const updateCountryResponse = await request(server)
        .post('/')
        .set('Authorization', loginResponse.body.data.login.token)
        .send({
          query: updateCountry,
          variables: {
            id: 9,
            input: testUpdateCountry,
          },
        })

      expectError(updateCountryResponse, COUNTRY_NOT_FOUND)
    })

    it('should throw if user is not authorized', async () => {
      const response = await request(server)
        .post('/')
        .send({
          query: updateCountry,
          variables: {
            id: 9,
            input: testUpdateCountry,
          },
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

      const updateCountryResponse = await request(server)
        .post('/')
        .set('Authorization', signUpResponse.body.data.signUp.token)
        .send({
          query: updateCountry,
          variables: {
            id: 9,
            input: testUpdateCountry,
          },
        })

      expectError(updateCountryResponse, FORBIDDEN)
    })
  })

  describe('deleteCountry', () => {
    it('should delete country', async () => {
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

      const addCountryResponse = await request(server)
        .post('/')
        .set('Authorization', loginResponse.body.data.login.token)
        .send({
          query: addCountry,
          variables: {
            input: testCountry,
          },
        })
  
      const deleteCountryResponse = await request(server)
        .post('/')
        .set('Authorization', loginResponse.body.data.login.token)
        .send({
          query: deleteCountry,
          variables: {
            id: addCountryResponse.body.data.addCountry.id,
          },
        })

      expect(deleteCountryResponse.body.data.deleteCountry).toEqual(null)
      expect(deleteCountryResponse.statusCode).toBe(200)
    })

    it('should throw if country is not found', async () => {
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
  
      const deleteCountryResponse = await request(server)
        .post('/')
        .set('Authorization', loginResponse.body.data.login.token)
        .send({
          query: deleteCountry,
          variables: {
            id: 9,
          },
        })

      expectError(deleteCountryResponse, COUNTRY_NOT_FOUND)
    })

    it('should throw if user is not authorized', async () => {
      const response = await request(server)
        .post('/')
        .send({
          query: deleteCountry,
          variables: {
            id: 9,
          },
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

      const deleteCountryResponse = await request(server)
        .post('/')
        .set('Authorization', signUpResponse.body.data.signUp.token)
        .send({
          query: deleteCountry,
          variables: {
            id: 9,
          },
        })

      expectError(deleteCountryResponse, FORBIDDEN)
    })
  })
})
