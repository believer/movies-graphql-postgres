const { pgp } = require('../../../adapters/db')
const movie = require('../../../services/movie')
const { verifyToken } = require('../../../services/token')

module.exports = async (_, { input }, { db, token }) => {
  try {
    const user = await verifyToken(token)

    let { imdbId, rating } = input
    const { date, wilhelm } = input

    imdbId = imdbId.match(/tt\d+/)
    rating = parseInt(rating, 10)

    if (!imdbId || !imdbId[0]) {
      throw new Error('No IMDb ID')
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
      wilhelm,
    }

    const columns = pgp.helpers.ColumnSet(
      [
        'imdb_id',
        'release_date',
        'runtime',
        'synopsis',
        'tagline',
        'title',
        'tmdb_id',
        'year',
        'wilhelm',
      ],
      {
        table: 'movies',
      }
    )

    const nothingConflict = 'ON CONFLICT DO NOTHING'
    const movieConflict =
      'ON CONFLICT ON CONSTRAINT movies_imdb_id_key DO UPDATE SET imdb_id=$1 RETURNING *;'
    const insertMovieSql = pgp.helpers.insert(remappedMovie, columns)

    // Insert movie
    const insertedMovie = await db.one(`${insertMovieSql} ${movieConflict}`, [
      remappedMovie.imdb_id,
    ])

    const findRow = async (tableName, name) => {
      try {
        return await db.one(`SELECT id FROM ${tableName} WHERE name = $1`, name)
      } catch (e) {
        const insert = pgp.helpers.insert({ name }, ['name'], tableName)
        return await db.one(`${insert} RETURNING *`)
      }
    }

    const findColumns = data => Object.keys(data)

    const runQuery = async (tableName, data) => {
      const query = pgp.helpers.insert(data, findColumns(data), tableName)
      return db.none(`${query} ${nothingConflict}`)
    }

    const addPeople = async (people, role_id) => {
      people.forEach(async name => {
        const row = await findRow('people', name)

        const data = {
          movie_id: insertedMovie.id,
          role_id,
          person_id: row.id,
        }

        await runQuery('cast_and_crew', data)
      })
    }

    // Insert genres
    preparedMovie.genres.forEach(async name => {
      const row = await findRow('genres', name)

      const data = {
        genre_id: row.id,
        movie_id: insertedMovie.id,
      }

      await runQuery('movie_genres', data)
    })

    preparedMovie.languages.forEach(async name => {
      const row = await findRow('languages', name)
      const data = {
        language_id: row.id,
        movie_id: insertedMovie.id,
      }

      await runQuery('movie_languages', data)
    })

    preparedMovie.production_companies.forEach(async name => {
      const row = await findRow('production_companies', name)
      const data = {
        production_company_id: row.id,
        movie_id: insertedMovie.id,
      }

      await runQuery('movie_production_companies', data)
    })

    preparedMovie.countries.forEach(async name => {
      const row = await findRow('countries', name)
      const data = {
        country_id: row.id,
        movie_id: insertedMovie.id,
      }

      await runQuery('movie_countries', data)
    })

    await addPeople(preparedMovie.director, 1)
    await addPeople(preparedMovie.cast, 2)
    await addPeople(preparedMovie.writer, 3)
    await addPeople(preparedMovie.music, 4)

    // IMAGES
    const imageData = {
      movie_id: insertedMovie.id,
      backdrop: preparedMovie.images.backdrop || '',
      poster: preparedMovie.images.poster || '',
    }

    await runQuery('images', imageData)

    // VIEWS
    const viewData = {
      movie_id: insertedMovie.id,
      user_id: user.id,
      view_date: date || new Date(),
    }

    await runQuery('views', viewData)

    // RATING
    if (rating) {
      const ratingData = {
        movie_id: insertedMovie.id,
        user_id: user.id,
        rating,
      }

      await runQuery('ratings', ratingData)
    }

    return insertedMovie
  } catch (e) {
    throw new Error(e)
  }
}
