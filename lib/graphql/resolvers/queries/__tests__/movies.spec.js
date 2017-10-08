const movies = require('../movies')
const { db } = require('../../../../adapters/db')

jest.mock('../../../../adapters/db', () => ({
  db: {
    query: jest.fn().mockReturnValue('dbData')
  }
}))

describe('queries/movies', () => {
  beforeEach(() => {
    db.query.mockClear()
  })

  it('should query for all movies', () => {
    movies(null, { limit: 10, offset: 0 })

    expect(db.query.mock.calls[0][0]).toMatchSnapshot()
  })

  it('should return database data', async () => {
    const response = await movies(null, { limit: 10, offset: 0 })

    expect(response).toEqual('dbData')
  })

  it('should handle errors', async () => {
    db.query.mockImplementation(() => Promise.reject('nope'))

    try {
      await movies(null, { limit: 10, offset: 0 })
    } catch (e) {
      expect(e.message).toMatch(/nope/)
    }
  })
})
