const views = require('../views')
const { verifyToken } = require('../../../../services/token')

jest.mock('../../../../services/token', () => ({
  verifyToken: jest.fn().mockImplementation(() =>
    Promise.resolve({
      id: 2,
    })
  ),
}))

describe('queries/views', () => {
  let db

  beforeEach(() => {
    db = {
      query: jest.fn().mockReturnValue('dbData'),
    }
  })

  it('should verify token', () => {
    views(null, {}, { db, token: 'test' })

    expect(verifyToken).toHaveBeenCalledWith('test')
  })

  it('should get views', async () => {
    await views(null, { offset: 0, limit: 10 }, { db })

    expect(db.query.mock.calls[0][0]).toMatchSnapshot()
  })

  it('should return database data', async () => {
    const response = await views(null, { offset: 0, limit: 10 }, { db })

    expect(response).toEqual('dbData')
  })

  it('should handle errors', async () => {
    db.query.mockImplementation(() => Promise.reject('nope'))

    try {
      await views(null, { offset: 0, limit: 10 }, { db })
    } catch (e) {
      expect(e.message).toMatch(/nope/)
    }
  })
})
