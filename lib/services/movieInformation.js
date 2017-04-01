const { pick } = require('lodash')

module.exports = function movieInformation (movie) {
  const props = [
    'backdrop_path',
    'genres',
    'id',
    'imdb_id',
    'overview',
    'original_title',
    'poster_path',
    'production_companies',
    'release_date',
    'runtime',
    'spoken_languages',
    'tagline'
  ]

  return pick(movie, props)
}
