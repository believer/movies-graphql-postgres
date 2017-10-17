const totalByRole = require('../totalByRole')
const { verifyToken } = require('../../../../services/token')

jest.mock('../../../../services/token', () => ({
  verifyToken: jest.fn().mockImplementation(() =>
    Promise.resolve({
      id: 2,
    })
  ),
}))

describe('queries/totalByRole', () => {
  let db

  beforeEach(() => {
    db = {
      one: jest.fn().mockReturnValue({
        count: 1,
      }),
    }
  })

  it('should verify token', () => {
    totalByRole(null, { ranking: 10 }, { db, token: 'test' })

    expect(verifyToken).toHaveBeenCalledWith('test')
  })

  it('should get how many movies a for a specific role', async () => {
    await totalByRole(
      null,
      {
        userId: '1',
        role: 'director',
      },
      { db }
    )

    expect(db.one.mock.calls[0][0]).toMatchSnapshot()
  })

  it('should return database data', async () => {
    const response = await totalByRole(
      null,
      {
        userId: '1',
        role: 'director',
      },
      { db }
    )

    expect(response).toEqual(1)
  })

  it('should handle errors', async () => {
    db.one.mockImplementation(() => Promise.reject('nope'))

    try {
      await totalByRole(
        null,
        {
          userId: '1',
          role: 'director',
        },
        { db }
      )
    } catch (e) {
      expect(e.message).toMatch(/nope/)
    }
  })
})
