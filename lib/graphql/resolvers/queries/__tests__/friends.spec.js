const friends = require('../friends')
const { verifyToken } = require('../../../../services/token')

jest.mock('../../../../services/token', () => ({
  verifyToken: jest.fn().mockImplementation(() =>
    Promise.resolve({
      id: 2,
    })
  ),
}))

describe('queries/friends', () => {
  let db

  beforeEach(() => {
    db = {
      query: jest.fn().mockReturnValue('dbData'),
    }
  })

  it('should verify token', () => {
    friends(null, { ranking: 10 }, { db, token: 'test' })

    expect(verifyToken).toHaveBeenCalledWith('test')
  })

  it('should get the best movies for each year', async () => {
    await friends(null, { ranking: 10 }, { db })

    expect(db.query.mock.calls[0][0]).toMatchSnapshot()
  })

  it('should return database data', async () => {
    const response = await friends(null, { ranking: 10 }, { db })

    expect(response).toEqual('dbData')
  })

  it('should handle errors', async () => {
    db.query.mockImplementation(() => Promise.reject('nope'))

    try {
      await friends(null, { ranking: 10 }, { db })
    } catch (e) {
      expect(e.message).toMatch(/nope/)
    }
  })
})
