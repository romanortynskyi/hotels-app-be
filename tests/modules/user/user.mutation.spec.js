const request = require('supertest')

const uploadService = require('~/modules/upload/upload.service')

const setupApp = require('../../setup-app')
const serverCleanup = require('../../server-cleanup')
const {
  signUp,
} = require('./user.helper')
const dbCleanup = require('../../db-cleanup')
const testImage = require('../../test-image')

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
      const response = await request(server).post('/').send({
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
        })
      )
    })

    it.only('should sign up with image', async () => {
      uploadService.uploadFile.mockResolvedValue({
        src: 'src',
        filename: 'filename',
      })

      const response = await request(server)
        .post('/')
        .set('Content-Type', 'multipart/form-data')
        .field(
          'operations',
          JSON.stringify({
            query: signUp,
            variables: {
              input: testUser,
              image: null,
            },
          })
        )
        .field(
          'map',
          JSON.stringify({
            image: ['variables.image'],
          })
        )
        .attach('image', testImage)



console.log(response.body.errors[0])
      console.log(response.body)
    })
  })
})
