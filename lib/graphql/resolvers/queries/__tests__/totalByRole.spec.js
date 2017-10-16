const totalByRole = require('../totalByRole')
const { db } = require('../../../../adapters/db')

jest.mock('../../../../adapters/db', () => ({
  db: {
    one: jest.fn().mockReturnValue({ count: 1 }),
  },
}))

describe('queries/totalByRole', () => {
  beforeEach(() => {
    db.one.mockClear()
  })

  it('should get how many movies a for a specific role', () => {
    totalByRole(null, {
      userId: '1',
      role: 'director',
    })

    expect(db.one.mock.calls[0][0]).toMatchSnapshot()
  })

  it('should return database data', async () => {
    const response = await totalByRole(null, {
      userId: '1',
      role: 'director',
    })

    expect(response).toEqual(1)
  })

  it('should handle errors', async () => {
    db.one.mockImplementation(() => Promise.reject('nope'))

    try {
      await totalByRole(null, {
        userId: '1',
        role: 'director',
      })
    } catch (e) {
      expect(e.message).toMatch(/nope/)
    }
  })
})
