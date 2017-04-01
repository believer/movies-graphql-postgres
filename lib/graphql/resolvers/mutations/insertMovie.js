const db = require('../../../adapters/db')
const movie = require('../../../services/movie')

const addPeople = async (people, movie_id, role_id) => {
  people.forEach(async (name) => {
    let person = await db.select('people', {
      columns: [ 'id' ],
      where: { name }
    })

    if (!person.length) {
      person = await db.insert('people', 'name', { name })
    }

    return db.insert('cast_and_crew', 'movie_id', {
      movie_id,
      role_id,
      person_id: person.id || person[0].id
    })
  })
}

module.exports = async (_, { input }) => {
  let { imdbId, rating } = input
  const { userId, date, wilhelm } = input

  imdbId = imdbId.match(/tt\d+/)
  rating = parseInt(rating, 10)

  if (!imdbId || !imdbId[0]) {
    throw new Error('No IMDb imdbId')
  }

  imdbId = imdbId[0]

  const preparedMovie = await movie(imdbId)
  const remappedMovie = {
    imdb_id: preparedMovie.ids.imdb,
    release_date: preparedMovie.release_date,
    runtime: preparedMovie.runtime,
    synopsis: preparedMovie.overview,
    tagline: preparedMovie.tagline,
    title: preparedMovie.title,
    tmdb_id: preparedMovie.ids.tmdb,
    year: preparedMovie.release_date.substr(0, 4),
    wilhelm: wilhelm
  }

  const { id } = await db.insert('movies', remappedMovie)

  preparedMovie.genres.forEach(async (name) => {
    const row = await db.select('genres', {
      columns: [ 'id' ],
      where: { name }
    })

    if (!row.length) {
      row = await db.insert('genres', 'name', { name })
    }

    return db.insert('movie_genres', 'movie_id', {
      genre_id: row.id || row[0].id,
      movie_id: id
    })
  })

  preparedMovie.languages.forEach(async (name) => {
    const row = await db.select('languages', {
      columns: [ 'id' ],
      where: { name }
    })

    if (!row.length) {
      row = await db.insert('languages', 'name', { name })
    }

    return db.insert('movie_languages', 'movie_id', {
      language_id: row.id || row[0].id,
      movie_id: id
    })
  })

  preparedMovie.production_companies.forEach(async (name) => {
    const row = await db.select('production_companies', {
      columns: [ 'id' ],
      where: { name }
    })

    if (!row.length) {
      row = await db.insert('production_companies', 'name', { name })
    }

    return db.insert('movie_production_companies', 'movie_id', {
      production_company_id: row.id || row[0].id,
      movie_id: id
    })
  })

  preparedMovie.countries.forEach(async (name) => {
    let row = await db.select('countries', {
      columns: [ 'id' ],
      where: { name }
    })

    if (!row.length) {
      row = await db.insert('countries', 'name', { name })
    }

    return db.insert('movie_countries', 'movie_id', {
      country_id: row.id || row[0].id,
      movie_id: id
    })
  })

  await addPeople(preparedMovie.director, id, 1)
  await addPeople(preparedMovie.cast, id, 2)
  await addPeople(preparedMovie.writer, id, 3)
  await addPeople(preparedMovie.music, id, 4)

  await db.insert('images', 'movie_id', {
    movie_id: id,
    backdrop: preparedMovie.images.backdrop,
    poster: preparedMovie.images.poster
  })

  await db.insert('views', 'movie_id', {
    movie_id: id,
    user_id: userId,
    view_date: new Date()
  })

  await db.insert('ratings', 'movie_id', {
    movie_id: id,
    user_id: userId,
    rating
  })

  return preparedMovie
}
