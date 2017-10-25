const moviedb = require('moviedb')
const mdb = moviedb(process.env.TMDB_KEY)

function credits (id) {
  return new Promise((resolve, reject) => {
    mdb.movieCredits({ id }, (err, credits) => {
      if (err) {
        reject(err)
      }

      resolve(credits)
    })
  })
}

function info (id) {
  return new Promise((resolve, reject) => {
    mdb.movieInfo({ id }, (err, information) => {
      if (err) {
        reject(err)
      }

      resolve(information)
    })
  })
}

module.exports = {
  info,
  credits,
}
