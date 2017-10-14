const feed = require('../feed')
const { db, } = require('../../../../adapters/db')

jest.mock('../../../../adapters/db', () => ({
  db: {
    query: jest.fn().mockReturnValue('dbData'),
  },
}))

describe('queries/feed', () => {
  beforeEach(() => {
    db.query.mockClear()
  })

  it('should query for all users', () => {
    feed(null, { limit: 10, offset: 0, })

    expect(db.query.mock.calls[0][0]).toMatchSnapshot()
  })

  it('should query for a specific user', () => {
    feed(null, { userId: 2, limit: 10, offset: 0, })

    expect(db.query.mock.calls[0][0]).toMatchSnapshot()
  })

  it('should return database data', async () => {
    const response = await feed(null, { userId: 2, limit: 10, offset: 0, })

    expect(response).toEqual('dbData')
  })

  it('should handle errors', async () => {
    db.query.mockImplementation(() => Promise.reject('nope'))

    try {
      await feed(null, { userId: 2, limit: 10, offset: 0, })
    } catch (e) {
      expect(e.message).toMatch(/nope/)
    }
  })
})
