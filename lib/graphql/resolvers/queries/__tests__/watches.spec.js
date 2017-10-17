const watches = require('../watches')
const { verifyToken } = require('../../../../services/token')

jest.mock('../../../../services/token', () => ({
  verifyToken: jest.fn().mockImplementation(() =>
    Promise.resolve({
      id: 2,
    })
  ),
}))

describe('queries/watches', () => {
  let db

  beforeEach(() => {
    db = {
      one: jest.fn().mockReturnValue('dbData'),
    }
  })

  it('should verify token', () => {
    watches(null, {}, { db, token: 'test' })

    expect(verifyToken).toHaveBeenCalledWith('test')
  })

  it('should get watch stats for a user', async () => {
    await watches(null, {}, { db })

    expect(db.one.mock.calls[0][0]).toMatchSnapshot()
  })

  it('should return database data', async () => {
    const response = await watches(null, {}, { db })

    expect(response).toEqual('dbData')
  })

  it('should handle errors', async () => {
    db.one.mockImplementation(() => Promise.reject('nope'))

    try {
      await watches(null, {}, { db })
    } catch (e) {
      expect(e.message).toMatch(/nope/)
    }
  })
})
