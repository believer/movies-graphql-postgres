const tmdb = require('./tmdb')
const omdb = require('./omdb')
const movieInformation = require('./movieInformation')
const movieSimplify = require('./movieSimplify')

module.exports = async function movie (imdbId) {
  const tmdbMovie = await tmdb.info(imdbId)
  const selectedFields = movieInformation(tmdbMovie)
  const movieWithCast = await tmdb.credits(selectedFields)
  const simplifiedMovie = await movieSimplify(movieWithCast)
  const movieWithOmdb = await omdb(simplifiedMovie)

  return movieWithOmdb
}
