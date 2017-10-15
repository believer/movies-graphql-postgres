const views = require('../views')
const { db } = require('../../../../adapters/db')

jest.mock('../../../../adapters/db', () => ({
  db: {
    query: jest.fn().mockReturnValue('dbData'),
  },
}))

describe('queries/views', () => {
  beforeEach(() => {
    db.query.mockClear()
  })

  it('should get views', () => {
    views(null, { offset: 0, limit: 10 })

    expect(db.query.mock.calls[0][0]).toMatchSnapshot()
  })

  it('should get views a specific user', () => {
    views(null, { offset: 0, limit: 10, userId: '1' })

    expect(db.query.mock.calls[0][0]).toMatchSnapshot()
  })

  it('should return database data', async () => {
    const response = await views(null, { offset: 0, limit: 10, userId: '1' })

    expect(response).toEqual('dbData')
  })

  it('should handle errors', async () => {
    db.query.mockImplementation(() => Promise.reject('nope'))

    try {
      await views(null, { offset: 0, limit: 10, userId: '1' })
    } catch (e) {
      expect(e.message).toMatch(/nope/)
    }
  })
})
