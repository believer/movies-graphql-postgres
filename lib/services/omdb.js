const fetch = require('node-fetch')
const _ = require('lodash')

function formatList(raw) {
  var list

  if (!raw) {
    return []
  }

  list = raw.replace(/\(.+?\)/g, '').split(', ')
  return list.map(item => item.trim())
}

module.exports = async function omdbInformation(movie) {
  if (!movie.ids.imdb) {
    return movie
  }

  const omdb = `http://www.omdbapi.com/?apikey=${process.env.OMDB_KEY}`

  try {
    const omdbMovie = await fetch(
      `${omdb}&i=${movie.ids.imdb}&tomatoes=true&plot=full`
    )

    if (Object.keys(movie.cast).length === 0 && omdbMovie.Actors) {
      movie.cast = formatList(omdbMovie.Actors)
    }

    if (Object.keys(movie.director).length === 0 && omdbMovie.Director) {
      movie.director = omdbMovie.Director.split(', ')
    }

    if (Object.keys(movie.writer).length === 0 && omdbMovie.Writer) {
      movie.writer = formatList(omdbMovie.Writer)
    }

    movie.countries = formatList(omdbMovie.Country)
    movie.genres = _.uniq(movie.genres.concat(formatList(omdbMovie.Genre)))
    movie.awards = formatList(omdbMovie.Awards)
    movie.ratings = {
      imdb: {
        rating: omdbMovie.imdbRating,
        votes: omdbMovie.imdbVotes
      },
      tomatoes: omdbMovie.tomatoMeter || {},
      metacritic: {
        rating: omdbMovie.Metascore || {}
      }
    }

    return movie
  } catch (err) {
    throw new Error(`OMDB ERROR: ${err}`)
  }
}
