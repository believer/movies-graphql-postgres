const login = require('../login')
const { db } = require('../../../../adapters/db')
const { invalidPassword } = require('../../../../services/login')

jest.mock('../../../../adapters/db', () => ({
  db: {
    one: jest.fn()
  }
}))

jest.mock('../../../../services/login', () => ({
  invalidPassword: jest.fn()
}))

describe('mutations/login', () => {
  beforeEach(() => {
    db.one.mockClear()
  })

  it('should get a specific user', () => {
    login(null, { input: { username: 'batman@waynecorp.org', password: '' } })

    expect(db.one.mock.calls[0][0]).toMatchSnapshot()
  })

  it('should return error if wrong password', async () => {
    db.one.mockImplementation(() => Promise.resolve({ password: 'hej', username: 'batman'}))
    invalidPassword.mockReturnValue(true)

    try {
      await login(null, {
        input: { username: 'batman@waynecorp.org', password: 'robin4ever' }
      })
    } catch (e) {
      expect(e.message).toMatch(/Wrong username or password/)
    }
  })

  it('should return database data', async () => {
    invalidPassword.mockReturnValue(false)
    db.one.mockReturnValue({ name: 'Bruce Wayne', id: 3})

    const response = await login(null, {
      input: { username: 'batman@waynecorp.org', password: '' }
    })

    expect(response).toMatchSnapshot()
  })

  it('should handle errors', async () => {
    db.one.mockImplementation(() => Promise.reject('nope'))

    try {
      await login(null, {
        input: { username: 'batman@waynecorp.org', password: '' }
      })
    } catch (e) {
      expect(e.message).toMatch(/nope/)
    }
  })
})
