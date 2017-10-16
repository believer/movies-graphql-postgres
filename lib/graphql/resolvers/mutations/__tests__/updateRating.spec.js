const updateRating = require('../updateRating')
const { db } = require('../../../../adapters/db')
const getMovie = require('../../queries/movie')

jest.mock('../../../../adapters/db', () => ({
  db: {
    one: jest.fn().mockReturnValue('dbData'),
  },
  pgp: {
    helpers: {
      update: jest.fn().mockReturnValue('UPDATE.helper'),
    },
  },
}))

jest.mock('../../queries/movie', () => jest.fn())

describe('mutations/updateRating', () => {
  beforeEach(() => {
    db.one.mockClear()
  })

  it('should update a specific rating', () => {
    updateRating(null, { input: { movieId: '1', userId: 2, rating: 10 } })

    expect(db.one.mock.calls[0][0]).toMatchSnapshot()
  })

  it('should get the movie', () => {
    updateRating(null, { input: { movieId: '1', userId: 2, rating: 10 } })

    expect(getMovie).toHaveBeenCalledWith(null, { id: '1' })
  })

  it('should return database data', async () => {
    getMovie.mockReturnValue(
      Promise.resolve({
        test: 'test',
      })
    )

    const response = await updateRating(null, {
      input: { movieId: '1', userId: 2, rating: 10 },
    })

    expect(response).toEqual({ test: 'test' })
  })

  it('should handle errors', async () => {
    db.one.mockImplementation(() => Promise.reject('nope'))

    try {
      await updateRating(null, {
        input: { movieId: '1', userId: 2, rating: 10 },
      })
    } catch (e) {
      expect(e.message).toMatch(/nope/)
    }
  })
})
