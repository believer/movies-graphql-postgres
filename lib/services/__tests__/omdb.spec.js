const omdb = require('../omdb')
const fetch = require('node-fetch')

jest.mock('node-fetch', () => jest.fn())

describe('#omdb', () => {
  let movie

  beforeEach(() => {
    movie = {
      added: 1507536210,
      cast: ['Edward Norton', 'Brad Pitt'],
      director: [],
      genres: ['Drama'],
      ids: {
        imdb: 'tt0137523',
        tmdb: '550'
      },
      images: {
        backdrop: '/fCayJrkfRaCRCTh8GqN30f8oyQF.jpg',
        poster: null
      },
      languages: ['English'],
      music: [],
      overview:
        'A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy. Their concept catches on, with underground fight clubs forming in every town, until an eccentric gets in the way and ignites an out-of-control spiral toward oblivion.',
      production_companies: ['20th Century Fox'],
      production_countries: [
        {
          iso_3166_1: 'US',
          name: 'United States of America'
        }
      ],
      release_date: '1999-10-12',
      runtime: 139,
      tagline:
        "How much can you know about yourself if you've never been in a fight?",
      title: 'Fight Club',
      writer: ['Jim Uhls'],
      year: '1999'
    }
  })

  it('should return movie if no imdb id', async () => {
    movie = Object.assign({}, movie, { ids: { imdb: undefined, tmdb: '550' } })

    try {
      const result = await omdb(movie)

      expect(result).toEqual(movie)
    } catch (e) {
      throw new Error(e)
    }
  })

  it('should fetch data from OMDb', async () => {
    try {
      fetch.mockImplementation(() => Promise.resolve({}))

      const result = await omdb(movie)

      expect(fetch).toHaveBeenCalledWith(
        'http://www.omdbapi.com/?apikey=undefined&i=tt0137523&tomatoes=true&plot=full'
      )
    } catch (e) {
      throw new Error(e)
    }
  })

  it('should set cast if not already set', async () => {
    try {
      movie = Object.assign({}, movie, { cast: [] })

      fetch.mockImplementation(() =>
        Promise.resolve({
          Actors: 'Edward Norton, Brad Pitt, Meat Loaf, Zach Grenier'
        })
      )

      const result = await omdb(movie)

      expect(result).toMatchSnapshot()
    } catch (e) {
      throw new Error(e)
    }
  })

  it('should set director if not already set', async () => {
    try {
      movie = Object.assign({}, movie, { director: [] })

      fetch.mockImplementation(() =>
        Promise.resolve({
          Director: 'David Fincher'
        })
      )

      const result = await omdb(movie)

      expect(result).toMatchSnapshot()
    } catch (e) {
      throw new Error(e)
    }
  })

  it('should set writer if not already set', async () => {
    try {
      movie = Object.assign({}, movie, { writer: [] })

      fetch.mockImplementation(() =>
        Promise.resolve({
          Writer: 'Chuck Palahniuk (novel), Jim Uhls (screenplay)'
        })
      )

      const result = await omdb(movie)

      expect(result).toMatchSnapshot()
    } catch (e) {
      throw new Error(e)
    }
  })

  it('should add extra meta data', async () => {
    try {
      fetch.mockImplementation(() =>
        Promise.resolve({
          Country: 'USA, Germany',
          Genre: 'Drama',
          Awards: 'Nominated for 1 Oscar. Another 10 wins & 32 nominations.',
          Metascore: '66',
          imdbRating: '8.8',
          imdbVotes: '1,490,021'
        })
      )

      const result = await omdb(movie)

      expect(result).toMatchSnapshot()
    } catch (e) {
      throw new Error(e)
    }
  })

  it('should handle errors', async () => {
    try {
      fetch.mockImplementation(() => Promise.reject('err'))

      const result = await omdb(movie)
    } catch (e) {
      expect(e.message).toEqual('OMDB ERROR: err')
    }
  })
})
