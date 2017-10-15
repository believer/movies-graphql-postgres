const movie = require('../movie')
const tmdb = require('../tmdb')
const omdb = require('../omdb')
const movieInformation = require('../movieInformation')
const movieSimplify = require('../movieSimplify')

jest.mock('../tmdb', () => ({
  info: jest.fn().mockReturnValue(
    Promise.resolve({
      original_title: 'test',
    })
  ),
  credits: jest.fn().mockReturnValue(
    Promise.resolve({
      title: 'test',
      cast: [{ id: 1, name: 'cast' }],
    })
  ),
}))

jest.mock('../omdb', () =>
  jest.fn().mockReturnValue(
    Promise.resolve({
      title: 'test',
      cast: ['cast'],
    })
  )
)

jest.mock('../movieInformation', () =>
  jest.fn().mockReturnValue({
    title: 'test',
  })
)

jest.mock('../movieSimplify', () =>
  jest.fn().mockReturnValue(
    Promise.resolve({
      title: 'test',
      cast: ['cast'],
    })
  )
)

describe('#movie', () => {
  it('should get movie information', () => {
    movie('tt1333337')

    expect(tmdb.info).toHaveBeenCalledWith('tt1333337')
  })

  it('should parse movie information', () => {
    movie('tt1333337')

    expect(movieInformation).toHaveBeenCalledWith({ original_title: 'test' })
  })

  it('should get movie credits', () => {
    movie('tt1333337')

    expect(tmdb.credits).toHaveBeenCalledWith({ title: 'test' })
  })

  it('should simplify movie structure', () => {
    movie('tt1333337')

    expect(movieSimplify).toHaveBeenCalledWith({
      title: 'test',
      cast: [{ id: 1, name: 'cast' }],
    })
  })

  it('should get additional information from OMDB', () => {
    movie('tt1333337')

    expect(omdb).toHaveBeenCalledWith({
      title: 'test',
      cast: ['cast'],
    })
  })

  it('should return a completed movie', async () => {
    try {
      const result = await movie('tt1333337')

      expect(result).toEqual({
        title: 'test',
        cast: ['cast'],
      })
    } catch (e) {
      throw new Error(e)
    }
  })
})
