const register = require('../register')
// const { saltAndHashPassword } = require('../../../services/login')
const { validEmail } = require('../../../../utils/validation')

// jest.mock('../../../services/login', () => ({
//   saltAndHashPassword: jest.fn().mockReturnValue({
//     hashPassword: 'hashpasword',
//     salt: 'thisissalt',
//   }),
// }))

jest.mock('../../../../utils/validation', () => ({
  validEmail: jest.fn().mockReturnValue(true),
}))

describe('mutations/register', () => {
  let db

  beforeEach(() => {
    db = {
      query: jest.fn(),
    }
  })

  it('returns error if invalid email', async () => {
    try {
      await register(
        null,
        {
          input: { email: 'batmanwaynecorp.org', password: 'robin4ever', name: 'Batman' },
        },
        { db }
      )
    } catch (e) {
      expect(e.message).toMatch(/Invalid email/)
    }
  })

  it('returns error if to short password', async () => {
    try {
      await register(
        null,
        {
          input: { email: 'batman@waynecorp.org', password: 'robin', name: 'Batman' },
        },
        { db }
      )
    } catch (e) {
      expect(e.message).toMatch(/Passwords needs to be at least 8 characters/)
    }
  })
})
