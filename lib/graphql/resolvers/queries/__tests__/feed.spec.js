const feed = require('../feed')

describe('queries/feed', () => {
  let db

  beforeEach(() => {
    db = {
      query: jest.fn().mockReturnValue('dbData'),
    }

    db.query.mockClear()
  })

  it('should query for all users', () => {
    feed(null, { limit: 10, offset: 0 }, { db })

    expect(db.query.mock.calls[0][0]).toMatchSnapshot()
  })

  it('should query for a specific user', () => {
    feed(null, { userId: 2, limit: 10, offset: 0 }, { db })

    expect(db.query.mock.calls[0][0]).toMatchSnapshot()
  })

  it('should return database data', async () => {
    const response = await feed(
      null,
      { userId: 2, limit: 10, offset: 0 },
      { db }
    )

    expect(response).toEqual('dbData')
  })

  it('should handle errors', async () => {
    db.query.mockImplementation(() => Promise.reject('nope'))

    try {
      await feed(null, { userId: 2, limit: 10, offset: 0 }, { db })
    } catch (e) {
      expect(e.message).toMatch(/nope/)
    }
  })
})
