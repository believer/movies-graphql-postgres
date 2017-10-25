const insertMovie = require('../insertMovie')
const movieService = require('../../../../services/movie')
const { verifyToken } = require('../../../../services/token')
const { upsert, addToMovieTable } = require('../../../../utils/helpers')
const knex = require('../../../../adapters/knex')
const mockdate = require('mockdate')

jest.mock('../../../../adapters/knex', () =>
  jest.fn().mockReturnValue({
    insert: jest.fn(input => input),
  })
)

jest.mock('../../../../utils/helpers', () => ({
  upsert: jest.fn().mockReturnValue('upsertId'),
  addToMovieTable: jest.fn(),
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
    mockdate.set('2017-11-12')

    knex.raw = jest.fn().mockImplementation(() =>
      Promise.resolve({
        rows: [
          {
            id: '1337',
          },
        ],
      })
    )

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
      adult: false,
      backdrop_path: '/mVr0UiqyltcfqxbAUcLl9zWL8ah.jpg',
      belongs_to_collection: {
        backdrop_path: '/57zhlMYblPute6qb8v16ZmGSPVv.jpg',
        id: 422837,
        name: 'Blade Runner Collection',
        poster_path: '/foT46aJ7QPUFDl3CK8ArDl0JaZX.jpg',
      },
      budget: 150000000,
      cast: [
        'Ryan Gosling',
        'Harrison Ford',
        'Ana de Armas',
        'Robin Wright',
        'Jared Leto',
        'Sylvia Hoeks',
        'Mackenzie Davis',
        'Carla Juri',
        'Dave Bautista',
        'Lennie James',
        'Hiam Abbass',
        'David Dastmalchian',
        'Barkhad Abdi',
        'Wood Harris',
        'Tómas Lemarquis',
        'Edward James Olmos',
        'Sean Young',
        'Mark Arnold',
        'Krista Kosonen',
        'Elarica Johnson',
        'Kingston Taylor',
        'David Benson',
        'Ben Thompson',
        'Suzie Kennedy',
        'Stephen Triffitt',
        'Ellie Wright',
        'Loren Peta',
      ],
      director: ['Denis Villeneuve'],
      genres: ['Action', 'Mystery', 'Science Fiction', 'Thriller'],
      homepage: 'http://bladerunnermovie.com/',
      id: 335984,
      imdb_id: 'tt1856101',
      music: ['Hans Zimmer', 'Benjamin Wallfisch'],
      original_language: 'en',
      original_title: 'Blade Runner 2049',
      overview:
        'Thirty years after the events of the first film, a new blade runner, LAPD Officer K, unearths a long-buried secret that has the potential to plunge what\'s left of society into chaos. K\'s discovery leads him on a quest to find Rick Deckard, a former LAPD blade runner who has been missing for 30 years.',
      popularity: 443.770778,
      poster_path: '/aMpyrCizvSdc0UIMblJ1srVgAEF.jpg',
      producer: [
        'Dana Belcastro',
        'Bill Carraro',
        'Tim Gamble',
        'Frank Giustra',
        'Broderick Johnson',
        'Andrew A. Kosove',
        'Carl Rogers',
        'Ridley Scott',
        'Cynthia Sikes',
        'Steven P. Wegner',
        'Bud Yorkin',
        'Ridley Scott',
      ],
      production_companies: [
        'Alcon Entertainment',
        'Scott Free Productions',
        'Warner Bros.',
        'Thunderbird Films',
        'Torridon Films',
      ],
      production_countries: ['United States of America'],
      release_date: '2017-10-04',
      revenue: 156551405,
      runtime: 163,
      spoken_languages: ['English'],
      status: 'Released',
      tagline: '',
      title: 'Blade Runner 2049',
      tmdb_id: 335984,
      video: false,
      vote_average: 7.7,
      vote_count: 986,
      writer: ['Hampton Fancher', 'Michael Green'],
    }

    movieService.mockReturnValue(movie)
    jest.clearAllMocks()
  })

  afterEach(() => {
    mockdate.reset()
  })

  it('should verify token', async () => {
    try {
      await insertMovie(null, { input }, context)

      expect(verifyToken).toHaveBeenCalledWith('test')
    } catch (e) {
      throw new Error(e)
    }
  })

  it('should get movie information', async () => {
    try {
      await insertMovie(null, { input }, context)

      expect(movieService).toHaveBeenCalledWith('tt1337')
    } catch (e) {
      throw new Error(e)
    }
  })

  it('should insert a movie', async () => {
    try {
      await insertMovie(null, { input }, context)

      expect(knex).toHaveBeenCalledWith('movies')
      expect(knex().insert.mock.calls[0][0]).toMatchSnapshot()
      expect(knex.raw.mock.calls[0]).toMatchSnapshot()
    } catch (e) {
      throw new Error(e)
    }
  })

  it('should insert a view for specific date', async () => {
    try {
      await insertMovie(null, { input }, context)

      expect(knex).toHaveBeenCalledWith('views')
      expect(knex().insert).toHaveBeenCalledWith({
        movie_id: '1337',
        user_id: 2,
        view_date: '2017-10-01',
      })
    } catch (e) {
      throw new Error(e)
    }
  })

  it('should insert a view for current date', async () => {
    try {
      input = {
        imdbId: 'tt1337',
        rating: 10,
        wilhelm: true,
      }

      await insertMovie(null, { input }, context)

      expect(knex).toHaveBeenCalledWith('views')
      expect(knex().insert).toHaveBeenCalledWith({
        movie_id: '1337',
        user_id: 2,
        view_date: '2017-11-12T00:00:00.000Z',
      })
    } catch (e) {
      throw new Error(e)
    }
  })

  it('should insert a rating if rating is set', async () => {
    try {
      await insertMovie(null, { input }, context)

      expect(knex).toHaveBeenCalledWith('views')
      expect(knex().insert).toHaveBeenCalledWith({
        movie_id: '1337',
        user_id: 2,
        rating: 10,
      })
      expect(knex.raw).toHaveBeenCalledWith('? ON CONFLICT DO NOTHING', [
        {
          movie_id: '1337',
          rating: 10,
          user_id: 2,
        },
      ])
    } catch (e) {
      throw new Error(e)
    }
  })

  it('should not insert a rating if no rating is provided', async () => {
    try {
      input = {
        imdbId: 'tt1337',
        wilhelm: true,
      }

      await insertMovie(null, { input }, context)

      expect(knex).toHaveBeenCalledWith('views')
      expect(knex().insert).not.toHaveBeenCalledWith({
        movie_id: '1337',
        user_id: 2,
        rating: 10,
      })
    } catch (e) {
      throw new Error(e)
    }
  })

  it('should insert images', async () => {
    try {
      const expected = {
        movie_id: '1337',
        backdrop: movie.backdrop_path,
        poster: movie.poster_path,
      }

      await insertMovie(null, { input }, context)

      expect(knex).toHaveBeenCalledWith('images')
      expect(knex().insert).toHaveBeenCalledWith(expected)
      expect(knex.raw).toHaveBeenCalledWith('? ON CONFLICT DO NOTHING', [
        expected,
      ])
    } catch (e) {
      throw new Error(e)
    }
  })

  it('should insert images with fallback path', async () => {
    try {
      movieService.mockReturnValue({
        ...movie,
        backdrop_path: undefined,
        poster_path: undefined,
      })

      const expected = {
        movie_id: '1337',
        backdrop: '',
        poster: '',
      }

      await insertMovie(null, { input }, context)

      expect(knex).toHaveBeenCalledWith('images')
      expect(knex().insert).toHaveBeenCalledWith(expected)
      expect(knex.raw).toHaveBeenCalledWith('? ON CONFLICT DO NOTHING', [
        expected,
      ])
    } catch (e) {
      throw new Error(e)
    }
  })

  it('should insert genres', async () => {
    try {
      await insertMovie(null, { input }, context)

      movie.genres.forEach(genre => {
        expect(upsert).toHaveBeenCalledWith('genres', genre)
        expect(addToMovieTable).toHaveBeenCalledWith('movie_genres', {
          movie_id: '1337',
          genre_id: 'upsertId',
        })
      })
    } catch (e) {
      throw new Error(e)
    }
  })

  it('should insert languages', async () => {
    try {
      await insertMovie(null, { input }, context)

      movie.spoken_languages.forEach(langauge => {
        expect(upsert).toHaveBeenCalledWith('languages', langauge)
        expect(addToMovieTable).toHaveBeenCalledWith('movie_languages', {
          movie_id: '1337',
          language_id: 'upsertId',
        })
      })
    } catch (e) {
      throw new Error(e)
    }
  })

  it('should insert production companies', async () => {
    try {
      await insertMovie(null, { input }, context)

      movie.production_companies.forEach(company => {
        expect(upsert).toHaveBeenCalledWith('production_companies', company)
        expect(
          addToMovieTable
        ).toHaveBeenCalledWith('movie_production_companies', {
          movie_id: '1337',
          production_company_id: 'upsertId',
        })
      })
    } catch (e) {
      throw new Error(e)
    }
  })

  it('should insert countries', async () => {
    try {
      await insertMovie(null, { input }, context)

      movie.production_countries.forEach(country => {
        expect(upsert).toHaveBeenCalledWith('countries', country)
        expect(addToMovieTable).toHaveBeenCalledWith('movie_countries', {
          movie_id: '1337',
          country_id: 'upsertId',
        })
      })
    } catch (e) {
      throw new Error(e)
    }
  })

  it('should insert people', async () => {
    try {
      await insertMovie(null, { input }, context)

      movie.director.forEach(name => {
        expect(upsert).toHaveBeenCalledWith('people', name)
        expect(addToMovieTable).toHaveBeenCalledWith('cast_and_crew', {
          movie_id: '1337',
          person_id: 'upsertId',
          role_id: 1,
        })
      })

      movie.cast.forEach(name => {
        expect(upsert).toHaveBeenCalledWith('people', name)
        expect(addToMovieTable).toHaveBeenCalledWith('cast_and_crew', {
          movie_id: '1337',
          person_id: 'upsertId',
          role_id: 2,
        })
      })

      movie.writer.forEach(name => {
        expect(upsert).toHaveBeenCalledWith('people', name)
        expect(addToMovieTable).toHaveBeenCalledWith('cast_and_crew', {
          movie_id: '1337',
          person_id: 'upsertId',
          role_id: 3,
        })
      })

      movie.music.forEach(name => {
        expect(upsert).toHaveBeenCalledWith('people', name)
        expect(addToMovieTable).toHaveBeenCalledWith('cast_and_crew', {
          movie_id: '1337',
          person_id: 'upsertId',
          role_id: 4,
        })
      })

      movie.producer.forEach(name => {
        expect(upsert).toHaveBeenCalledWith('people', name)
        expect(addToMovieTable).toHaveBeenCalledWith('cast_and_crew', {
          movie_id: '1337',
          person_id: 'upsertId',
          role_id: 5,
        })
      })
    } catch (e) {
      throw new Error(e)
    }
  })

  it('should return the inserted movie', async () => {
    try {
      const result = await insertMovie(null, { input }, context)

      expect(result).toMatchSnapshot()
    } catch (e) {
      throw new Error(e)
    }
  })

  it('should handle errors', async () => {
    try {
      movieService.mockImplementation(() => {
        throw new Error('errorz')
      })

      await insertMovie(null, { input }, context)
    } catch (e) {
      expect(e.message).toMatch(/errorz/)
    }
  })
})
