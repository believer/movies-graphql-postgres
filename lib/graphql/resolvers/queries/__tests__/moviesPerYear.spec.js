const moviesPerYear = require('../moviesPerYear')
const { db } = require('../../../../adapters/db')

jest.mock('../../../../adapters/db', () => ({
  db: {
    query: jest.fn().mockReturnValue('dbData'),
  },
}))

describe('queries/moviesPerYear', () => {
  beforeEach(() => {
    db.query.mockClear()
  })

  it('should get total movies per year', () => {
    moviesPerYear(null, {})

    expect(db.query.mock.calls[0][0]).toMatchSnapshot()
  })

  it('should get total movies for a specific year', () => {
    moviesPerYear(null, { year: '2017' })

    expect(db.query.mock.calls[0][0]).toMatchSnapshot()
  })

  it('should return database data', async () => {
    const response = await moviesPerYear(null, { userId: 2, ranking: 10 })

    expect(response).toEqual('dbData')
  })

  it('should handle errors', async () => {
    db.query.mockImplementation(() => Promise.reject('nope'))

    try {
      await moviesPerYear(null, { userId: 2, ranking: 10 })
    } catch (e) {
      expect(e.message).toMatch(/nope/)
    }
  })
})
