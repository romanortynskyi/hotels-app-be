const request = require('supertest')
const bcrypt = require('bcrypt')

const uploadService = require('~/modules/upload/upload.service')
const {
  USER_ALREADY_EXISTS,
  INTERNAL_SERVER_ERROR,
  INCORRECT_CREDENTIALS,
  USER_NOT_FOUND,
} = require('~/consts/errors')
const { SALT_ROUNDS } = require('~/consts')
const { User } = require('~/models')

const setupApp = require('../../setup-app')
const serverCleanup = require('../../server-cleanup')
const {
  signUp,
  login,
  updateUser,
  deleteUser,
} = require('./user.helper')
const {
  mockFileResponse,
  mockUploadFile,
  mockUploadFileError,
} = require('../../mocks')
const { expectError } = require('../../helpers')

const testUser = {
  firstName: 'vasya',
  lastName: 'pupkin',
  email: 'vasya@gmail.com',
  password: '123123'
}

const wrongEmail = 'email@gmail.com'
const wrongPassword = 'password'

describe('user mutations', () => {
  let server

  beforeEach(async () => {
    ({ server } = await setupApp())
  })

  afterEach(async () => {
    await serverCleanup(server)
  })

  describe('signUp', () => {
    it('should sign up without image', async () => {
      const response = await request(server)
        .post('/')
        .send({
          query: signUp,
          variables: {
            input: testUser,
            image: null,
          },
        })
      
      expect(response.body.data.signUp).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          firstName: testUser.firstName,
          lastName: testUser.lastName,
          email: testUser.email,
          token: expect.any(String),
        })
      )
    })

    it('should sign up with image', async () => {
      uploadService.uploadFile = mockUploadFile

      const response = await request(server)
        .post('/')
        .set('Content-Type', 'multipart/form-data')
        .set('Apollo-Require-Preflight', true)
        .field('operations', JSON.stringify({
          query: signUp,
          variables: {
            input: testUser,
            image: null,
          },
        }))
        .field('map', JSON.stringify({ 0: ['variables.image'] }))
        .attach('0', 'tests/test-image.jpg')

      expect(response.body.data.signUp).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          firstName: testUser.firstName,
          lastName: testUser.lastName,
          email: testUser.email,
          image: mockFileResponse,
          token: expect.any(String),
        })
      )
    })

    it('should throw if user exists', async () => {
      await request(server)
        .post('/')
        .send({
          query: signUp,
          variables: {
            input: testUser,
            image: null,
          },
        })

      const response = await request(server)
        .post('/')

        .send({
          query: signUp,
          variables: {
            input: testUser,
            image: null,
          },
        })

      expectError(response, USER_ALREADY_EXISTS)
    })

    it('should throw if image upload threw', async () => {
      uploadService.uploadFile = mockUploadFileError

      const response = await request(server)
        .post('/')
        .set('Content-Type', 'multipart/form-data')
        .set('Apollo-Require-Preflight', true)
        .field('operations', JSON.stringify({
          query: signUp,
          variables: {
            input: testUser,
            image: null,
          },
        }))
        .field('map', JSON.stringify({ 0: ['variables.image'] }))
        .attach('0', 'tests/test-image.jpg')

      expectError(response, INTERNAL_SERVER_ERROR)
    })
  })

  describe('login', () => {
    it('should login', async () => {
      await request(server)
        .post('/')
        .send({
          query: signUp,
          variables: {
            input: testUser,
            image: null,
          },
        })

      const response = await request(server)
        .post('/')
        .send({
          query: login,
          variables: {
            input: {
              email: testUser.email,
              password: testUser.password,
            },
          },
        })

      expect(response.body.data.login).toEqual(
          expect.objectContaining({
            id: expect.any(Number),
            firstName: testUser.firstName,
            lastName: testUser.lastName,
            email: testUser.email,
            token: expect.any(String),
          })
        )
    })

    it('should throw if email is incorrect', async () => {
      await request(server)
        .post('/')
        .send({
          query: signUp,
          variables: {
            input: testUser,
            image: null,
          },
        })

      const response = await request(server)
        .post('/')
        .send({
          query: login,
          variables: {
            input: {
              email: wrongEmail,
              password: testUser.password,
            },
          },
        })

      expectError(response, INCORRECT_CREDENTIALS)
    })

    it('should throw if password is incorrect', async () => {
      await request(server)
        .post('/')
        .send({
          query: signUp,
          variables: {
            input: testUser,
            image: null,
          },
        })

      const response = await request(server)
        .post('/')
        .send({
          query: login,
          variables: {
            input: {
              email: testUser.email,
              password: wrongPassword,
            },
          },
        })

      expectError(response, INCORRECT_CREDENTIALS)
    })
  })

  describe('updateUser', () => {
    it('should update user', async () => {
      uploadService.uploadFile = mockUploadFile

      await request(server)
        .post('/')
        .send({
          query: signUp,
          variables: {
            input: testUser,
            image: null,
          },
        })

      const loginResponse = await request(server)
        .post('/')
        .send({
          query: login,
          variables: {
            input: {
              email: testUser.email,
              password: testUser.password,
            },
          },
        })

      const updateUserResponse = await request(server)
        .post('/')
        .set('Content-Type', 'multipart/form-data')
        .set('Apollo-Require-Preflight', true)
        .set('Authorization', loginResponse.body.data.login.token)
        .field('operations', JSON.stringify({
          query: updateUser,
          variables: {
            id: loginResponse.body.data.login.id,
            input: {
              firstName: testUser.firstName,
              lastName: testUser.lastName,
            },
            image: null,
            shouldDeleteImage: false,
          },
        }))
        .field('map', JSON.stringify({ 0: ['variables.image'] }))
        .attach('0', 'tests/test-image.jpg')
        
      expect(updateUserResponse.body.data.updateUser).toEqual(
        expect.objectContaining({
          id: loginResponse.body.data.login.id,
          firstName: testUser.firstName,
          lastName: testUser.lastName,
          email: testUser.email,
          image: mockFileResponse,
        })
      )
    })

    it('should update user and update image', async () => {
      uploadService.uploadFile = mockUploadFile
      uploadService.deleteFile = jest.fn()

      await request(server)
        .post('/')
        .send({
          query: signUp,
          variables: {
            input: testUser,
            image: null,
          },
        })

      const loginResponse = await request(server)
        .post('/')
        .send({
          query: login,
          variables: {
            input: {
              email: testUser.email,
              password: testUser.password,
            },
          },
        })

      const updateUserResponse = await request(server)
        .post('/')
        .set('Content-Type', 'multipart/form-data')
        .set('Apollo-Require-Preflight', true)
        .set('Authorization', loginResponse.body.data.login.token)
        .field('operations', JSON.stringify({
          query: updateUser,
          variables: {
            id: loginResponse.body.data.login.id,
            input: {
              firstName: testUser.firstName,
              lastName: testUser.lastName,
            },
            image: null,
            shouldDeleteImage: true,
          },
        }))
        .field('map', JSON.stringify({ 0: ['variables.image'] }))
        .attach('0', 'tests/test-image.jpg')
        
      expect(updateUserResponse.body.data.updateUser).toEqual(
        expect.objectContaining({
          id: loginResponse.body.data.login.id,
          firstName: testUser.firstName,
          lastName: testUser.lastName,
          email: testUser.email,
          image: mockFileResponse,
        })
      )
    })

    it('should update user and delete image', async () => {
      uploadService.uploadFile = mockUploadFile
      uploadService.deleteFile = jest.fn()

      await request(server)
        .post('/')
        .send({
          query: signUp,
          variables: {
            input: testUser,
            image: null,
          },
        })

      const loginResponse = await request(server)
        .post('/')
        .send({
          query: login,
          variables: {
            input: {
              email: testUser.email,
              password: testUser.password,
            },
          },
        })

      await request(server)
        .post('/')
        .set('Content-Type', 'multipart/form-data')
        .set('Apollo-Require-Preflight', true)
        .set('Authorization', loginResponse.body.data.login.token)
        .field('operations', JSON.stringify({
          query: updateUser,
          variables: {
            id: loginResponse.body.data.login.id,
            input: {
              firstName: testUser.firstName,
              lastName: testUser.lastName,
            },
            image: null,
            shouldDeleteImage: false,
          },
        }))
        .field('map', JSON.stringify({ 0: ['variables.image'] }))
        .attach('0', 'tests/test-image.jpg')

      const updateUserResponse = await request(server)
        .post('/')
        .set('Authorization', loginResponse.body.data.login.token)
        .send({
          query: updateUser,
          variables: {
            id: loginResponse.body.data.login.id,
            input: {
              firstName: testUser.firstName,
              lastName: testUser.lastName,
            },
            image: null,
            shouldDeleteImage: true,
          },
        })
        
      expect(updateUserResponse.body.data.updateUser).toEqual(
        expect.objectContaining({
          id: loginResponse.body.data.login.id,
          firstName: testUser.firstName,
          lastName: testUser.lastName,
          email: testUser.email,
          image: null,
        })
      )
    })

    it('should throw if upload service throws', async () => {
      uploadService.uploadFile = mockUploadFileError

      await request(server)
        .post('/')
        .send({
          query: signUp,
          variables: {
            input: testUser,
            image: null,
          },
        })

      const loginResponse = await request(server)
        .post('/')
        .send({
          query: login,
          variables: {
            input: {
              email: testUser.email,
              password: testUser.password,
            },
          },
        })

      const updateUserResponse = await request(server)
        .post('/')
        .set('Content-Type', 'multipart/form-data')
        .set('Apollo-Require-Preflight', true)
        .set('Authorization', loginResponse.body.data.login.token)
        .field('operations', JSON.stringify({
          query: updateUser,
          variables: {
            id: loginResponse.body.data.login.id,
            input: {
              firstName: testUser.firstName,
              lastName: testUser.lastName,
            },
            image: null,
            shouldDeleteImage: false,
          },
        }))
        .field('map', JSON.stringify({ 0: ['variables.image'] }))
        .attach('0', 'tests/test-image.jpg')

      expectError(updateUserResponse, INTERNAL_SERVER_ERROR)
    })
  })

  describe('deleteUser', () => {
    it('should delete user', async () => {
      await request(server)
        .post('/')
        .send({
          query: signUp,
          variables: {
            input: testUser,
            image: null,
          },
        })

      const loginResponse = await request(server)
        .post('/')
        .send({
          query: login,
          variables: {
            input: {
              email: testUser.email,
              password: testUser.password,
            },
          },
        })

      const deleteUserResponse = await request(server)
        .post('/')
        .set('Authorization', loginResponse.body.data.login.token)
        .send({
          query: deleteUser,
          variables: {
            id: loginResponse.body.data.login.id,
          },
        })

      expect(deleteUserResponse.body.data.deleteUser).toEqual(null)
    })

    it('should throw if user is not found', async () => {
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
        
      const response = await request(server)
        .post('/')
        .set('Authorization', loginResponse.body.data.login.token)
        .send({
          query: deleteUser,
          variables: {
            id: 10,
          },
        })

      expectError(response, USER_NOT_FOUND)
    })

    it('should throw if upload service throws', async () => {
      uploadService.uploadFile = mockUploadFile
      uploadService.deleteFile = jest.fn().mockRejectedValue()

      await request(server)
        .post('/')
        .send({
          query: signUp,
          variables: {
            input: testUser,
            image: null,
          },
        })

      const loginResponse = await request(server)
        .post('/')
        .send({
          query: login,
          variables: {
            input: {
              email: testUser.email,
              password: testUser.password,
            },
          },
        })

      await request(server)
        .post('/')
        .set('Content-Type', 'multipart/form-data')
        .set('Apollo-Require-Preflight', true)
        .set('Authorization', loginResponse.body.data.login.token)
        .field('operations', JSON.stringify({
          query: updateUser,
          variables: {
            id: loginResponse.body.data.login.id,
            input: {
              firstName: testUser.firstName,
              lastName: testUser.lastName,
            },
            image: null,
            shouldDeleteImage: true,
          },
        }))
        .field('map', JSON.stringify({ 0: ['variables.image'] }))
        .attach('0', 'tests/test-image.jpg')

      const deleteUserResponse = await request(server)
        .post('/')
        .set('Authorization', loginResponse.body.data.login.token)
        .send({
          query: deleteUser,
          variables: {
            id: loginResponse.body.data.login.id,
          },
        })

      expectError(deleteUserResponse, INTERNAL_SERVER_ERROR)
    })
  })
})
