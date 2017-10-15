const bestForYears = require('../bestForYears')
const { db } = require('../../../../adapters/db')

jest.mock('../../../../adapters/db', () => ({
  db: {
    query: jest.fn().mockReturnValue('dbData'),
  },
}))

describe('queries/bestForYears', () => {
  beforeEach(() => {
    db.query.mockClear()
  })

  it('should get the best movies for each year', () => {
    bestForYears(null, { userId: 2, ranking: 10 })

    expect(db.query.mock.calls[0][0]).toMatchSnapshot()
  })

  it('should return database data', async () => {
    const response = await bestForYears(null, { userId: 2, ranking: 10 })

    expect(response).toEqual('dbData')
  })

  it('should handle errors', async () => {
    db.query.mockImplementation(() => Promise.reject('nope'))

    try {
      await bestForYears(null, { userId: 2, ranking: 10 })
    } catch (e) {
      expect(e.message).toMatch(/nope/)
    }
  })
})
