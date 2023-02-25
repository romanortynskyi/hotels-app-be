const request = require('supertest')

const { BAD_TOKEN } = require('~/consts/errors')

const setupApp = require('../../setup-app')
const serverCleanup = require('../../server-cleanup')
const {
  signUp,
  getMe,
} = require('./user.helper')
const dbCleanup = require('../../db-cleanup')
const { expectError } = require('../../helpers')
const { testUser } = require('../../consts')

describe.skip('user queries', () => {
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

  describe('getMe', () => {
    it('should get me', async () => {
      const signUpResponse = await request(server)
        .post('/')
        .send({
          query: signUp,
          variables: {
            input: testUser,
            image: null,
          },
        })

      const getMeResponse = await request(server)
        .post('/')
        .set('Authorization', signUpResponse.body.data.signUp.token)
        .send({
          query: getMe,
        })

      expect(getMeResponse.body.data.getMe).toEqual(
        expect.objectContaining({
          id: signUpResponse.body.data.signUp.id,
          firstName: testUser.firstName,
          lastName: testUser.lastName,
          email: testUser.email,
          image: null,
        })
      )
    })

    it('should throw if token is invalid', async () => {
      const response = await request(server)
        .post('/')
        .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c')
        .send({
          query: getMe,
        })

      expectError(response, BAD_TOKEN)
    })
  })
})
