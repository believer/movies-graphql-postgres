const userMoviesPerYear = require('../userMoviesPerYear')
const { db, } = require('../../../../adapters/db')

jest.mock('../../../../adapters/db', () => ({
  db: {
    query: jest.fn().mockReturnValue('dbData'),
  },
}))

describe('queries/userMoviesPerYear', () => {
  beforeEach(() => {
    db.query.mockClear()
  })

  it('should get how many movies a user has seen per year', () => {
    userMoviesPerYear(null, {
      userId: '1',
    })

    expect(db.query.mock.calls[0][0]).toMatchSnapshot()
  })

  it('should return database data', async () => {
    const response = await userMoviesPerYear(null, {
      userId: '1',
    })

    expect(response).toEqual('dbData')
  })

  it('should handle errors', async () => {
    db.query.mockImplementation(() => Promise.reject('nope'))

    try {
      await userMoviesPerYear(null, {
        userId: '1',
      })
    } catch (e) {
      expect(e.message).toMatch(/nope/)
    }
  })
})
