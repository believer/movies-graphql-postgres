const tmdb = require('./tmdb')
const { getNames, getCrew } = require('../utils/helpers')

module.exports = async function movie (imdbId) {
  imdbId = imdbId.match(/tt\d+/)

  if (!imdbId || !imdbId[0]) {
    throw new Error('No IMDb ID')
  }

  imdbId = imdbId[0]

  const movieInfo = await tmdb.info(imdbId)
  const credits = await tmdb.credits(movieInfo.imdb_id)

  const simplifiedInformation = [
    'production_companies',
    'production_countries',
    'genres',
    'spoken_languages',
  ].reduce(
    (acc, curr) =>
      Object.assign({}, acc, {
        [curr]: getNames(movieInfo[curr]),
      }),
    {}
  )

  return Object.assign(
    {},
    movieInfo,
    simplifiedInformation,
    getCrew(credits.crew),
    {
      tmdb_id: movieInfo.id,
      cast: getNames(credits.cast),
    }
  )
}
