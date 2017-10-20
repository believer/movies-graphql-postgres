const totalByPerson = require('../totalByPerson')
const { verifyToken } = require('../../../../services/token')

jest.mock('../../../../services/token', () => ({
  verifyToken: jest.fn().mockImplementation(() =>
    Promise.resolve({
      id: 2,
    })
  ),
}))

describe('queries/totalByPerson', () => {
  let db

  beforeEach(() => {
    db = {
      query: jest.fn().mockReturnValue('dbData'),
    }
  })

  it('should verify token', () => {
    totalByPerson(null, { role: 'actor', ranked: 10 }, { db, token: 'test' })

    expect(verifyToken).toHaveBeenCalledWith('test')
  })

  it('should get how many movies actors are in sorted on ranking', async () => {
    try {
      await totalByPerson(null, { role: 'actor', ranked: 10 }, { db })

      expect(db.query.mock.calls[0][0]).toMatchSnapshot()
    } catch (e) {
      throw new Error(e)
    }
  })

  it('should get number of movies for a specific name', async () => {
    try {
      await totalByPerson(
        null,
        {
          role: 'actor',
          ranked: 10,
          name: 'Emma Watson',
        },
        { db }
      )

      expect(db.query.mock.calls[0][0]).toMatchSnapshot()
    } catch (e) {
      throw new Error(e)
    }
  })

  it('should return database data', async () => {
    const response = await totalByPerson(
      null,
      {
        role: 'actor',
        ranked: 10,
        name: 'Emma Watson',
      },
      { db }
    )

    expect(response).toEqual('dbData')
  })

  it('should handle errors', async () => {
    db.query.mockImplementation(() => Promise.reject('nope'))

    try {
      await totalByPerson(
        null,
        {
          role: 'actor',
          ranked: 10,
          name: 'Emma Watson',
        },
        { db }
      )
    } catch (e) {
      expect(e.message).toMatch(/nope/)
    }
  })
})
