const ratings = require('../ratings')
const { db } = require('../../../../adapters/db')

jest.mock('../../../../adapters/db', () => ({
  db: {
    query: jest.fn().mockReturnValue('dbData'),
  },
}))

describe('queries/ratings', () => {
  beforeEach(() => {
    db.query.mockClear()
  })

  it('should get ratings for a movie', () => {
    ratings(null, { movieId: '1' })

    expect(db.query.mock.calls[0][0]).toMatchSnapshot()
  })

  it('should return database data', async () => {
    const response = await ratings(null, { movieId: '1' })

    expect(response).toEqual('dbData')
  })

  it('should handle errors', async () => {
    db.query.mockImplementation(() => Promise.reject('nope'))

    try {
      await ratings(null, { movieId: '1' })
    } catch (e) {
      expect(e.message).toMatch(/nope/)
    }
  })
})
