const moviesWithRating = require('../moviesWithRating')
const { db } = require('../../../../adapters/db')

jest.mock('../../../../adapters/db', () => ({
  db: {
    query: jest.fn().mockReturnValue('dbData'),
  },
}))

describe('queries/moviesWithRating', () => {
  beforeEach(() => {
    db.query.mockClear()
  })

  it('should get all movies with rating', () => {
    moviesWithRating(null, { rating: 10 })

    expect(db.query.mock.calls[0][0]).toMatchSnapshot()
  })

  it('should return database data', async () => {
    const response = await moviesWithRating(null, { userId: 2, ranking: 10 })

    expect(response).toEqual('dbData')
  })

  it('should handle errors', async () => {
    db.query.mockImplementation(() => Promise.reject('nope'))

    try {
      await moviesWithRating(null, { rating: 9 })
    } catch (e) {
      expect(e.message).toMatch(/nope/)
    }
  })
})
