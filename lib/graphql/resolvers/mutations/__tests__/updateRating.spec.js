const updateRating = require('../updateRating')
const getMovie = require('../../queries/movie')
const { verifyToken } = require('../../../../services/token')

jest.mock('../../../../adapters/db', () => ({
  pgp: {
    helpers: {
      update: jest.fn().mockReturnValue('UPDATE.helper'),
    },
  },
}))

jest.mock('../../../../services/token', () => ({
  verifyToken: jest.fn().mockImplementation(() =>
    Promise.resolve({
      id: 2,
    })
  ),
}))

jest.mock('../../queries/movie', () => jest.fn())

describe('mutations/updateRating', () => {
  let db

  beforeEach(() => {
    db = {
      one: jest.fn().mockReturnValue('dbData'),
    }
  })

  it('should verify token', async () => {
    try {
      await updateRating(
        null,
        { input: { movieId: '1', rating: 10 } },
        { db, token: 'test' }
      )

      expect(verifyToken).toHaveBeenCalledWith('test')
    } catch (e) {
      throw new Error(e)
    }
  })

  it('should update a specific rating', async () => {
    try {
      await updateRating(null, { input: { movieId: '1', rating: 10 } }, { db })

      expect(db.one.mock.calls[0][0]).toMatchSnapshot()
    } catch (e) {
      throw new Error(e)
    }
  })

  it('should get the movie', async () => {
    try {
      await updateRating(null, { input: { movieId: '1', rating: 10 } }, { db })

      expect(getMovie).toHaveBeenCalledWith(null, { id: '1' })
    } catch (e) {
      throw new Error(e)
    }
  })

  it('should return database data', async () => {
    getMovie.mockReturnValue(
      Promise.resolve({
        test: 'test',
      })
    )

    try {
      const response = await updateRating(
        null,
        {
          input: { movieId: '1', rating: 10 },
        },
        { db }
      )

      expect(response).toEqual({ test: 'test' })
    } catch (e) {
      throw new Error(e)
    }
  })

  it('should handle errors', async () => {
    db.one.mockImplementation(() => Promise.reject('nope'))

    try {
      await updateRating(
        null,
        {
          input: { movieId: '1', rating: 10 },
        },
        { db }
      )
    } catch (e) {
      expect(e.message).toMatch(/nope/)
    }
  })
})
