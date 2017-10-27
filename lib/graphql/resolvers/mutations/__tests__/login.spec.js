const login = require('../login')
const { invalidPassword } = require('../../../../services/login')
const { issueToken } = require('../../../../services/token')

jest.mock('../../../../services/login', () => ({
  invalidPassword: jest.fn(),
}))

jest.mock('../../../../services/token', () => ({
  issueToken: jest.fn().mockReturnValue('token'),
}))

describe('mutations/login', () => {
  let db

  beforeEach(() => {
    db = {
      one: jest.fn(),
    }

    issueToken.mockClear()
  })

  it('should should trim username', async () => {
    try {
      db.one.mockReturnValue({
        name: 'Bruce Wayne',
        id: 3,
        password: 'p4zzw0rd',
      })

      await login(
        null,
        { input: { username: '  batman@waynecorp.org ', password: '' } },
        { db }
      )

      expect(db.one.mock.calls[0][0]).toMatchSnapshot()
    } catch (e) {
      throw new Error(e)
    }
  })

  it('should should lowercase username', async () => {
    try {
      db.one.mockReturnValue({
        name: 'Bruce Wayne',
        id: 3,
        password: 'p4zzw0rd',
      })

      await login(
        null,
        { input: { username: 'MATman@waynecorp.org', password: '' } },
        { db }
      )

      expect(db.one.mock.calls[0][0]).toMatchSnapshot()
    } catch (e) {
      throw new Error(e)
    }
  })

  it('should get a specific user', async () => {
    try {
      db.one.mockReturnValue({
        name: 'Bruce Wayne',
        id: 3,
        password: 'p4zzw0rd',
      })

      await login(
        null,
        { input: { username: 'batman@waynecorp.org', password: '' } },
        { db }
      )

      expect(db.one.mock.calls[0][0]).toMatchSnapshot()
    } catch (e) {
      throw new Error(e)
    }
  })

  it('should return error if wrong password', async () => {
    db.one.mockImplementation(() =>
      Promise.resolve({ password: 'hej', username: 'batman' })
    )
    invalidPassword.mockReturnValue(true)

    try {
      await login(
        null,
        {
          input: { username: 'batman@waynecorp.org', password: 'robin4ever' },
        },
        { db }
      )
    } catch (e) {
      expect(e.message).toMatch(/Wrong username or password/)
    }
  })

  it('should issue a token', async () => {
    try {
      const user = {
        name: 'Bruce Wayne',
        email: 'batman@waynecorp.org',
        id: 3,
        password: 'test',
        salt: 'salt',
      }
      const params = {
        input: { username: 'batman@waynecorp.org', password: '' },
      }

      invalidPassword.mockReturnValue(false)
      db.one.mockReturnValue(user)

      await login(null, params, { db })

      expect(issueToken.mock.calls[0][0]).toMatchSnapshot()
    } catch (e) {
      throw new Error(e)
    }
  })

  it('should return database data', async () => {
    try {
      invalidPassword.mockReturnValue(false)
      db.one.mockReturnValue({
        name: 'Bruce Wayne',
        id: 3,
        password: 'p4zzw0rd',
      })

      const response = await login(
        null,
        {
          input: { username: 'batman@waynecorp.org', password: '' },
        },
        { db }
      )

      expect(response).toEqual({
        token: 'token',
      })
    } catch (e) {
      throw new Error(e)
    }
  })

  it('should handle errors', async () => {
    expect.hasAssertions()
    db.one.mockImplementation(() => Promise.reject('nope'))

    try {
      await login(
        null,
        {
          input: { username: 'batman@waynecorp.org', password: '' },
        },
        { db }
      )
    } catch (e) {
      expect(e.message).toMatch(/nope/)
    }
  })
})
