const userMoviesPerYear = require('../userMoviesPerYear')
const { verifyToken } = require('../../../../services/token')

jest.mock('../../../../services/token', () => ({
  verifyToken: jest.fn().mockImplementation(() =>
    Promise.resolve({
      id: 2,
    })
  ),
}))

describe('queries/userMoviesPerYear', () => {
  let db

  beforeEach(() => {
    db = {
      query: jest.fn().mockReturnValue('dbData'),
    }
  })

  it('should verify token', () => {
    userMoviesPerYear(null, {}, { db, token: 'test' })

    expect(verifyToken).toHaveBeenCalledWith('test')
  })

  it('should get how many movies a user has seen per year', async () => {
    await userMoviesPerYear(null, {}, { db })

    expect(db.query.mock.calls[0][0]).toMatchSnapshot()
  })

  it('should return database data', async () => {
    const response = await userMoviesPerYear(null, {}, { db })

    expect(response).toEqual('dbData')
  })

  it('should handle errors', async () => {
    db.query.mockImplementation(() => Promise.reject('nope'))

    try {
      await userMoviesPerYear(null, {}, { db })
    } catch (e) {
      expect(e.message).toMatch(/nope/)
    }
  })
})
