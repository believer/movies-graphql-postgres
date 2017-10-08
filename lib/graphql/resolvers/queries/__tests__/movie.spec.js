const movie = require('../movie')
const { db } = require('../../../../adapters/db')

jest.mock('../../../../adapters/db', () => ({
  db: {
    one: jest.fn().mockReturnValue('dbData')
  }
}))

describe('queries/movie', () => {
  beforeEach(() => {
    db.one.mockClear()
  })

  it('should query for movie using id', () => {
    movie(null, { id: '1' })

    expect(db.one.mock.calls[0][0]).toMatchSnapshot()
  })

  it('should one for movie using IMDb id', () => {
    movie(null, { id: 'tt1234567' })

    expect(db.one.mock.calls[0][0]).toMatchSnapshot()
  })

  it('should return database data', async () => {
    const response = await movie(null, { id: '1' })

    expect(response).toEqual('dbData')
  })

  it('should handle errors', async () => {
    db.one.mockImplementation(() => Promise.reject('nope'))

    try {
      await movie(null, { id: '1' })
    } catch (e) {
      expect(e.message).toMatch(/nope/)
    }
  })
})
