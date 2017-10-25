const {
  getCrew,
  getNames,
  movieLaterals,
  movieSelects,
  findRoleId,
  upsert,
  addToMovieTable,
} = require('../helpers')
const knex = require('../../adapters/knex')

jest.mock('../../adapters/knex', () =>
  jest.fn().mockReturnValue({
    insert: jest.fn(input => input),
    where: jest.fn(() => ({
      first: jest.fn().mockReturnValue({ id: '1' }),
    })),
  })
)

describe('utils/helpers', () => {
  beforeEach(() => {
    knex.raw = jest.fn().mockImplementation(() =>
      Promise.resolve({
        rows: [
          {
            id: '1337',
          },
        ],
      })
    )
  })

  describe('#getCrew', () => {
    it('should sort crew members correctly', () => {
      const input = [
        { name: 'Darren Aronofsky', job: 'Director' },
        { name: 'Clint Mansell', job: 'Music' },
        { name: 'Clint Mansell', job: 'Original Music Composer' },
        { name: 'Hubert Selby Jr.', job: 'Writing' },
        { name: 'Hubert Selby Jr.', job: 'Writer' },
        { name: 'Darren Aronofsky', job: 'Screenplay' },
        { name: 'Random person', job: 'Grip' },
      ]

      expect(getCrew(input)).toMatchSnapshot()
    })
  })

  describe('#getNames', () => {
    it('should return names from array items', () => {
      const input = [
        { name: 'Cookie Monster', id: 1 },
        { name: 'Count van Count', id: 2 },
      ]

      expect(getNames(input)).toEqual(['Cookie Monster', 'Count van Count'])
    })
  })

  describe('#findRoleId', () => {
    it('should return 1 for director', () => {
      expect(findRoleId('director')).toEqual(1)
    })

    it('should return 2 for actor', () => {
      expect(findRoleId('actor')).toEqual(2)
    })

    it('should return 3 for writer', () => {
      expect(findRoleId('writer')).toEqual(3)
    })

    it('should return 4 for composer', () => {
      expect(findRoleId('composer')).toEqual(4)
    })

    it('should return 5 for producer', () => {
      expect(findRoleId('producer')).toEqual(5)
    })
  })

  describe('#movieLaterals', () => {
    it('should return a big join for movies', () => {
      expect(movieLaterals).toMatchSnapshot()
    })
  })

  describe('#movieSelects', () => {
    it('should return common select for movies', () => {
      expect(movieSelects).toMatchSnapshot()
    })
  })

  describe('#upsert', () => {
    it('should insert query in to table', async () => {
      try {
        knex().insert.mockImplementationOnce(() => ({
          rows: [{ id: '1337' }],
        }))

        await upsert('genres', 'Action')

        expect(knex).toHaveBeenCalledWith('genres')
        expect(knex().insert).toHaveBeenCalledWith({ name: 'Action' })
      } catch (e) {
        throw new Error(e)
      }
    })

    it('should return the inserted rows id', async () => {
      try {
        knex().insert.mockImplementationOnce(() => ({
          rows: [{ id: '1337' }],
        }))

        const id = await upsert('genres', 'Action')

        expect(id).toEqual('1337')
      } catch (e) {
        throw new Error(e)
      }
    })

    it('should find the existing row if insert throws (conflicting value)', async () => {
      try {
        knex().insert.mockImplementationOnce(() => {
          throw new Error('conflict')
        })

        await upsert('genres', 'Action')
      } catch (e) {
        expect(knex).toHaveBeenCalledWith('genres')
        expect(knex().where).toHaveBeenCalledWith({ name: 'Action' })
        expect(knex().where().first).toHaveBeenCalledWith('id')
      }
    })
  })

  describe('#addToMovieTable', () => {
    it('should insert query in to table', async () => {
      try {
        await addToMovieTable('genres', { test: 'test' })

        expect(knex).toHaveBeenCalledWith('genres')
        expect(knex().insert).toHaveBeenCalledWith({ test: 'test' })
      } catch (e) {
        throw new Error(e)
      }
    })

    it('should set conflict behavior', async () => {
      try {
        await addToMovieTable('genres', { test: 'test' })

        expect(knex.raw).toHaveBeenCalledWith('? ON CONFLICT DO NOTHING', [
          {
            test: 'test',
          },
        ])
      } catch (e) {
        throw new Error(e)
      }
    })
  })
})
