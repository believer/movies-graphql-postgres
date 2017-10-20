const insertMovie = require('../insertMovie')
const { pgp } = require('../../../../adapters/db')
const movieService = require('../../../../services/movie')
const { verifyToken } = require('../../../../services/token')

jest.mock('../../../../adapters/db', () => ({
  pgp: {
    helpers: {
      ColumnSet: jest.fn(),
      insert: jest.fn().mockReturnValue('INSERT.helper'),
      update: jest.fn().mockReturnValue('UPDATE.helper'),
    },
  },
}))

jest.mock('../../../../services/token', () => ({
  verifyToken: jest.fn().mockImplementation(() =>
    Promise.resolve({
      id: 2,
    })
  ),
}))

jest.mock('../../../../services/movie', () => jest.fn())

describe('mutations/insertMovie', () => {
  let input
  let movie
  let context

  beforeEach(() => {
    context = {
      db: {
        one: jest.fn().mockReturnValue('dbData'),
        none: jest.fn().mockReturnValue('dbData'),
      },
      token: 'test',
    }

    input = {
      imdbId: 'tt1337',
      rating: 10,
      date: '2017-10-01',
      wilhelm: true,
    }

    movie = {
      added: 1507536210,
      cast: ['Edward Norton', 'Brad Pitt'],
      countries: [],
      director: [],
      genres: ['Drama'],
      ids: {
        imdb: 'tt0137523',
        tmdb: '550',
      },
      images: {
        backdrop: '/fCayJrkfRaCRCTh8GqN30f8oyQF.jpg',
        poster: null,
      },
      languages: ['English'],
      music: [],
      overview:
        'A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy. Their concept catches on, with underground fight clubs forming in every town, until an eccentric gets in the way and ignites an out-of-control spiral toward oblivion.',
      production_companies: ['20th Century Fox'],
      production_countries: [
        {
          iso_3166_1: 'US',
          name: 'United States of America',
        },
      ],
      release_date: '1999-10-12',
      runtime: 139,
      tagline:
        'How much can you know about yourself if you\'ve never been in a fight?',
      title: 'Fight Club',
      writer: ['Jim Uhls'],
      year: '1999',
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should verify token', async () => {
    movieService.mockReturnValue(movie)

    try {
      await insertMovie(null, { input }, context)

      expect(verifyToken).toHaveBeenCalledWith('test')
    } catch (e) {
      throw new Error(e)
    }
  })

  it('should return an error if not a valid IMDb ID', async () => {
    expect.hasAssertions()

    input = Object.assign({}, input, { imdbId: '' })

    try {
      await insertMovie(null, { input }, context)
    } catch (e) {
      expect(e.message).toMatch(/No IMDb ID/)
    }
  })

  it('should create a column set for the movie', async () => {
    movieService.mockReturnValue(movie)

    try {
      await insertMovie(null, { input }, context)

      expect(pgp.helpers.ColumnSet.mock.calls[0]).toMatchSnapshot()
    } catch (e) {
      throw new Error(e)
    }
  })

  it('should create an insert statement', async () => {
    movieService.mockReturnValue(movie)
    pgp.helpers.ColumnSet.mockReturnValue('columns')

    try {
      await insertMovie(null, { input }, context)

      expect(pgp.helpers.insert.mock.calls[0]).toMatchSnapshot()
    } catch (e) {
      throw new Error(e)
    }
  })

  it('should handle errors', async () => {
    expect.hasAssertions()
    movieService.mockReturnValue(Promise.reject('err'))

    try {
      await insertMovie(null, { input }, context)
    } catch (e) {
      expect(e.message).toEqual('err')
    }
  })
})
