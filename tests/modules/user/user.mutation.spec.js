const request = require('supertest')

const uploadService = require('~/modules/upload/upload.service')
const {
  USER_ALREADY_EXISTS,
  INTERNAL_SERVER_ERROR,
} = require('~/consts/errors')

const setupApp = require('../../setup-app')
const serverCleanup = require('../../server-cleanup')
const {
  signUp,
} = require('./user.helper')
const dbCleanup = require('../../db-cleanup')
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

describe('user mutations', () => {
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
})
