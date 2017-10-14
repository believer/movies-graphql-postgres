const userRuntime = require('../userRuntime')
const { db, } = require('../../../../adapters/db')

jest.mock('../../../../adapters/db', () => ({
  db: {
    query: jest.fn().mockReturnValue([{ hours: 10, }, { minutes: 60, },]),
  },
}))

describe('queries/userRuntime', () => {
  beforeEach(() => {
    db.query.mockClear()
  })

  it('should get how many movies a for a specific role', () => {
    userRuntime(null, {
      userId: '1',
    })

    expect(db.query.mock.calls[0][0]).toMatchSnapshot()
  })

  it('should return database data', async () => {
    const response = await userRuntime(null, {
      userId: '1',
    })

    expect(response).toEqual({
      total_with_rewatches: { hours: 10, },
      total: { minutes: 60, },
    })
  })

  it('should handle errors', async () => {
    db.query.mockImplementation(() => Promise.reject('nope'))

    try {
      await userRuntime(null, {
        userId: '1',
      })
    } catch (e) {
      expect(e.message).toMatch(/nope/)
    }
  })
})
