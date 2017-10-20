const feed = require('../feed')
const { verifyToken } = require('../../../../services/token')

jest.mock('../../../../services/token', () => ({
  verifyToken: jest.fn().mockImplementation(() =>
    Promise.resolve({
      id: 2,
    })
  ),
}))

describe('queries/feed', () => {
  let context

  beforeEach(() => {
    context = {
      db: {
        query: jest.fn().mockReturnValue('dbData'),
      },
      token: 'test',
    }
  })

  afterEach(() => {
    context.db.query.mockClear()
  })

  it('should verify token', () => {
    feed(null, {}, context)

    expect(verifyToken).toHaveBeenCalledWith('test')
  })

  it('should query for a specific user', async () => {
    await feed(null, { limit: 10, offset: 0 }, context)

    expect(context.db.query.mock.calls[0][0]).toMatchSnapshot()
  })

  it('should return database data', async () => {
    const response = await feed(null, { limit: 10, offset: 0 }, context)

    expect(response).toEqual('dbData')
  })

  it('should handle errors', async () => {
    context.db.query.mockImplementation(() => Promise.reject('nope'))

    try {
      await feed(null, { limit: 10, offset: 0 }, context)
    } catch (e) {
      expect(e.message).toMatch(/nope/)
    }
  })
})
