const feed = require('../feed')

describe('queries/feed', () => {
  let context

  beforeEach(() => {
    context = {
      db: {
        query: jest.fn().mockReturnValue('dbData'),
      },
      user: {
        id: '2',
      },
    }
  })

  afterEach(() => {
    context.db.query.mockClear()
  })

  it('should query for a specific user', () => {
    feed(null, { limit: 10, offset: 0 }, context)

    expect(context.db.query.mock.calls[0][0]).toMatchSnapshot()
  })

  it('should return database data', async () => {
    const response = await feed(
      null,
      { userId: 2, limit: 10, offset: 0 },
      context
    )

    expect(response).toEqual('dbData')
  })

  it('should handle errors', async () => {
    context.db.query.mockImplementation(() => Promise.reject('nope'))

    try {
      await feed(null, { limit: 10, offset: 0 }, context)
    } catch (e) {
      expect(e.message).toMatch(/nope/)
    }
  })
})
