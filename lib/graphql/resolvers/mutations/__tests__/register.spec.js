const register = require('../register')
const { saltAndHashPassword } = require('../../../../services/login')
const { validEmail } = require('../../../../utils/validation')

jest.mock('../../../../services/login', () => ({
  saltAndHashPassword: jest.fn().mockReturnValue({
    hashPassword: 'hashpasword',
    salt: 'thisissalt',
  }),
}))

jest.mock('../../../../utils/validation', () => ({
  validEmail: jest.fn().mockImplementation(() => true),
}))

describe('mutations/register', () => {
  let db

  beforeEach(() => {
    db = {
      query: jest.fn(),
    }
  })

  it('should trim email', async () => {
    try {
      db.query.mockReturnValue([])

      await register(
        null,
        { input: { email: ' batman@waynecorp.org ', password: 'robin4ever', name: 'Batman' } },
        { db }
      )

      expect(validEmail).toHaveBeenCalledWith('batman@waynecorp.org')
    } catch (e) {
      throw new Error(e)
    }
  })

  it('should lowecases email', async () => {
    try {
      db.query.mockReturnValue([])

      await register(
        null,
        { input: { email: 'baTman@waynecorp.org', password: 'robin4ever', name: 'Batman' } },
        { db }
      )

      expect(validEmail).toHaveBeenCalledWith('batman@waynecorp.org')
    } catch (e) {
      throw new Error(e)
    }
  })

  it('returns error if invalid email', async () => {
    validEmail.mockImplementationOnce(() => false)

    try {
      await register(
        null,
        { input: { email: 'batmanwaynecorp.org', password: 'robin4ever', name: 'Batman' } },
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
        { input: { email: 'batman@waynecorp.org', password: 'robin', name: 'Batman' } },
        { db }
      )
    } catch (e) {
      expect(e.message).toMatch(/Passwords needs to be at least 8 characters/)
    }
  })

  it('calls db to check if user exists', async () => {
    try {
      db.query.mockReturnValue([])

      await register(
        null,
        { input: { email: 'batman@waynecorp.org', password: 'robin4ever', name: 'Batman' } },
        { db }
      )

      expect(db.query.mock.calls[0][0]).toMatchSnapshot()
    } catch (e) {
      throw new Error(e)
    }
  })

  it('returns error if user was found', async () => {
    try {
      db.query.mockReturnValue([{ email: 'batman@waynecorp.org' }])

      await register(
        null,
        { input: { email: 'batman@waynecorp.org', password: 'robin4ever', name: 'Batman' } },
        { db }
      )
    } catch (e) {
      expect(e.message).toMatch(/Invalid email/)
    }
  })

  it('calls db to insert new user', async () => {
    try {
      db.query.mockReturnValue([])

      await register(
        null,
        { input: { email: 'batman@waynecorp.org', password: 'robin4ever', name: 'Batman' } },
        { db }
      )

      expect(db.query.mock.calls[1][0]).toMatchSnapshot()
    } catch (e) {
      throw new Error(e)
    }
  })

  it('returns user', async () => {
    try {
      db.query.mockReturnValue([])

      const response = await register(
        null,
        { input: { email: 'batman@waynecorp.org', password: 'robin4ever', name: 'Batman' } },
        { db }
      )

      expect(response).toEqual({
        email: 'batman@waynecorp.org',
        name: 'Batman',
      })
    } catch (e) {
      throw new Error(e)
    }
  })

  it('should handle errors', async () => {
    expect.hasAssertions()
    db.query.mockImplementation(() => Promise.reject('nope'))

    try {
      await register(
        null,
        { input: { email: 'batman@waynecorp.org', password: 'robin4ever', name: 'Batman' } },
        { db }
      )
    } catch (e) {
      expect(e.message).toMatch(/nope/)
    }
  })
})
