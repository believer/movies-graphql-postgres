const person = require('../person')
const { db } = require('../../../../adapters/db')

jest.mock('../../../../adapters/db', () => ({
  db: {
    query: jest.fn().mockReturnValue('dbData'),
  },
}))

describe('queries/person', () => {
  beforeEach(() => {
    db.query.mockClear()
  })

  it('should get all movies for a person', () => {
    person(null, { name: 'Emma Watson', role: 'actor' })

    expect(db.query.mock.calls[0][0]).toMatchSnapshot()
  })

  it('should return database data', async () => {
    const response = await person(null, { name: 'Emma Watson', role: 'actor' })

    expect(response).toEqual('dbData')
  })

  it('should handle errors', async () => {
    db.query.mockImplementation(() => Promise.reject('nope'))

    try {
      await person(null, { name: 'Emma Watson', role: 'actor' })
    } catch (e) {
      expect(e.message).toMatch(/nope/)
    }
  })
})
