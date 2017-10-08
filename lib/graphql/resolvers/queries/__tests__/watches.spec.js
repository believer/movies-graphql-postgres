const watches = require('../watches')
const { db } = require('../../../../adapters/db')

jest.mock('../../../../adapters/db', () => ({
  db: {
    one: jest.fn().mockReturnValue('dbData')
  }
}))

describe('queries/watches', () => {
  beforeEach(() => {
    db.one.mockClear()
  })

  it('should get watch stats for a user', () => {
    watches(null, { userId: '1' })

    expect(db.one.mock.calls[0][0]).toMatchSnapshot()
  })

  it('should return database data', async () => {
    const response = await watches(null, { userId: '1' })

    expect(response).toEqual('dbData')
  })

  it('should handle errors', async () => {
    db.one.mockImplementation(() => Promise.reject('nope'))

    try {
      await watches(null, { userId: '1' })
    } catch (e) {
      expect(e.message).toMatch(/nope/)
    }
  })
})
