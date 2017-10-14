const users = require('../users')
const { db, } = require('../../../../adapters/db')

jest.mock('../../../../adapters/db', () => ({
  db: {
    query: jest.fn().mockReturnValue('dbData'),
  },
}))

describe('queries/users', () => {
  beforeEach(() => {
    db.query.mockClear()
  })

  it('should get users', () => {
    users(null, {})

    expect(db.query.mock.calls[0][0]).toMatchSnapshot()
  })

  it('should get a specific user', () => {
    users(null, { id: '1', })

    expect(db.query.mock.calls[0][0]).toMatchSnapshot()
  })

  it('should return database data', async () => {
    const response = await users(null, { id: '1', })

    expect(response).toEqual('dbData')
  })

  it('should handle errors', async () => {
    db.query.mockImplementation(() => Promise.reject('nope'))

    try {
      await users(null, { id: '1', })
    } catch (e) {
      expect(e.message).toMatch(/nope/)
    }
  })
})
