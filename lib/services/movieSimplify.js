const { getNames, getCrew, } = require('../utils/helpers')
const { omit, } = require('lodash')
const moment = require('moment')

module.exports = function movieSimplify (movie) {
  return new Promise(resolve => {
    movie.cast = getNames(movie.cast)
    movie.production_companies = getNames(movie.production_companies)
    movie.genres = getNames(movie.genres)
    movie.languages = getNames(movie.spoken_languages)
    movie.title = movie.original_title
    movie.year = movie.release_date.substr(0, 4)
    movie.added = moment().unix()

    movie.ids = {
      imdb: movie.imdb_id,
      tmdb: movie.id.toString(),
    }

    movie.images = {
      poster: movie.poster_path,
      backdrop: movie.backdrop_path,
    }

    const crew = getCrew(movie.crew)
    movie = Object.assign({}, movie, crew)

    const skipProps = [
      'spoken_languages',
      'backdrop_path',
      'poster_path',
      'id',
      'imdb_id',
      'original_title',
      'crew',
    ]

    resolve(omit(movie, skipProps))
  })
}
