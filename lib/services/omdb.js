const omdb = require('omdb')
const _ = require('lodash')

module.exports = function omdbInformation (movie) {
  return new Promise((resolve, reject) => {
    if (movie.ids.imdb) {
      omdb.get(movie.ids.imdb, { fullPlot: true, tomatoes: true }, (err, omdbMovie) => {
        if (err) {
          return reject(err)
        }

        if (!omdbMovie) {
          return resolve(movie)
        }

        if (_.isEmpty(movie.cast) && omdbMovie.actors) {
          movie.cast = omdbMovie.actors
        }

        if (_.isEmpty(movie.director) && omdbMovie.director) {
          movie.director = omdbMovie.director.split(', ')
        }

        if (_.isEmpty(movie.writer) && omdbMovie.writers) {
          movie.writer = omdbMovie.writers
        }

        movie.countries = omdbMovie.countries
        movie.genres = _.uniq(movie.genres.concat(omdbMovie.genres))
        movie.awards = omdbMovie.awards
        movie.ratings = {
          imdb: {
            rating: omdbMovie.imdb.rating,
            votes: omdbMovie.imdb.votes
          },
          tomatoes: omdbMovie.tomato || {},
          metacritic: {
            rating: omdbMovie.metacritic || {}
          }
        }

        resolve(movie)
      })
    } else {
      resolve(movie)
    }
  })
}
