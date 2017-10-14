const totalByPerson = require('../totalByPerson')
const { db, } = require('../../../../adapters/db')

jest.mock('../../../../adapters/db', () => ({
  db: {
    query: jest.fn().mockReturnValue('dbData'),
  },
}))

describe('queries/totalByPerson', () => {
  beforeEach(() => {
    db.query.mockClear()
  })

  it('should get how many movies actors are in sorted on ranking', () => {
    totalByPerson(null, { userId: '1', role: 'actor', ranked: 10, })

    expect(db.query.mock.calls[0][0]).toMatchSnapshot()
  })

  it('should get number of movies for a specific name', () => {
    totalByPerson(null, {
      userId: '1',
      role: 'actor',
      ranked: 10,
      name: 'Emma Watson',
    })

    expect(db.query.mock.calls[0][0]).toMatchSnapshot()
  })

  it('should return database data', async () => {
    const response = await totalByPerson(null, {
      userId: '1',
      role: 'actor',
      ranked: 10,
      name: 'Emma Watson',
    })

    expect(response).toEqual('dbData')
  })

  it('should handle errors', async () => {
    db.query.mockImplementation(() => Promise.reject('nope'))

    try {
      await totalByPerson(null, {
        userId: '1',
        role: 'actor',
        ranked: 10,
        name: 'Emma Watson',
      })
    } catch (e) {
      expect(e.message).toMatch(/nope/)
    }
  })
})
