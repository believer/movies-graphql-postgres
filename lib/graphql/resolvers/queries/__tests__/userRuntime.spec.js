const userRuntime = require('../userRuntime')
const { verifyToken } = require('../../../../services/token')

jest.mock('../../../../services/token', () => ({
  verifyToken: jest.fn().mockImplementation(() =>
    Promise.resolve({
      id: 2,
    })
  ),
}))

describe('queries/userRuntime', () => {
  let db

  beforeEach(() => {
    db = {
      query: jest.fn().mockReturnValue([{ hours: 10 }, { minutes: 60 }]),
    }
  })

  it('should verify token', () => {
    userRuntime(null, {}, { db, token: 'test' })

    expect(verifyToken).toHaveBeenCalledWith('test')
  })

  it('should get how many movies a for a specific role', async () => {
    await userRuntime(null, {}, { db })

    expect(db.query.mock.calls[0][0]).toMatchSnapshot()
  })

  it('should return database data', async () => {
    const response = await userRuntime(null, {}, { db })

    expect(response).toEqual({
      total_with_rewatches: { hours: 10 },
      total: { minutes: 60 },
    })
  })

  it('should handle errors', async () => {
    db.query.mockImplementation(() => Promise.reject('nope'))

    try {
      await userRuntime(null, {}, { db })
    } catch (e) {
      expect(e.message).toMatch(/nope/)
    }
  })
})
