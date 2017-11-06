const top250 = require('../top250')

describe('queries/top250', () => {
  let db

  beforeEach(() => {
    db = {
      query: jest.fn().mockReturnValue('dbData'),
    }
  })

  it('should query for top250', () => {
    top250(null, { limit: 200, offset: 0 }, { db })

    expect(db.query.mock.calls[0][0]).toMatchSnapshot()
  })

  it('should return database data', async () => {
    const response = await top250(null, { limit: 200, offset: 0 }, { db })

    expect(response).toEqual('dbData')
  })

  it('should handle errors', async () => {
    db.query.mockImplementation(() => Promise.reject('nope'))

    try {
      await top250(null, { limit: 200, offset: 0 }, { db })
    } catch (e) {
      expect(e.message).toMatch(/nope/)
    }
  })
})
