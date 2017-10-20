const knex = require('../../../adapters/knex')
const movie = require('../../../services/movie')
const { verifyToken } = require('../../../services/token')

module.exports = async (_, { input }, { token }) => {
  try {
    const user = await verifyToken(token)

    const { imdbId, rating, date, wilhelm } = input

    const preparedMovie = await movie(imdbId)

    //#region Insert Movie
    const movieProps = [
      'imdb_id',
      'release_date',
      'runtime',
      'overview',
      'tagline',
      'title',
      'tmdb_id',
      'year',
      'adult',
      'budget',
      'homepage',
    ].reduce(
      (acc, curr) => Object.assign({}, acc, { [curr]: preparedMovie[curr] }),
      { wilhelm }
    )

    const query = knex('movies').insert(movieProps)
    const movieUpsert = knex.raw(
      `? ON CONFLICT ON CONSTRAINT movies_imdb_id_key
      DO UPDATE SET imdb_id='${movieProps.imdb_id}' RETURNING *`,
      [query]
    )

    const upsertResult = await movieUpsert
    const insertedMovie = upsertResult.rows[0]
    //#endregion

    //#region View
    await knex('views').insert({
      movie_id: insertedMovie.id,
      user_id: user.id,
      view_date: date || new Date().toISOString(),
    })
    //#endregion

    //#region Rating
    if (rating) {
      const ratingQuery = knex('ratings').insert({
        movie_id: insertedMovie.id,
        user_id: user.id,
        rating,
      })

      await knex.raw('? ON CONFLICT DO NOTHING', [ratingQuery])
    }
    //#endregion

    return insertedMovie

    // const nothingConflict = 'ON CONFLICT DO NOTHING'

    // const findRow = async (tableName, name) => {
    //   try {
    //     return await db.one(`SELECT id FROM ${tableName} WHERE name = $1`, name)
    //   } catch (e) {
    //     const insert = pgp.helpers.insert({ name }, ['name'], tableName)
    //     return await db.one(`${insert} RETURNING *`)
    //   }
    // }

    // const findColumns = data => Object.keys(data)

    // const runQuery = async (tableName, data) => {
    //   const query = pgp.helpers.insert(data, findColumns(data), tableName)
    //   return db.none(`${query} ${nothingConflict}`)
    // }

    // const addPeople = async (people, role_id) => {
    //   people.forEach(async name => {
    //     const row = await findRow('people', name)

    //     const data = {
    //       movie_id: insertedMovie.id,
    //       role_id,
    //       person_id: row.id,
    //     }

    //     await runQuery('cast_and_crew', data)
    //   })
    // }

    // // Insert genres
    // preparedMovie.genres.forEach(async name => {
    //   const row = await findRow('genres', name)

    //   const data = {
    //     genre_id: row.id,
    //     movie_id: insertedMovie.id,
    //   }

    //   await runQuery('movie_genres', data)
    // })

    // preparedMovie.languages.forEach(async name => {
    //   const row = await findRow('languages', name)
    //   const data = {
    //     language_id: row.id,
    //     movie_id: insertedMovie.id,
    //   }

    //   await runQuery('movie_languages', data)
    // })

    // preparedMovie.production_companies.forEach(async name => {
    //   const row = await findRow('production_companies', name)
    //   const data = {
    //     production_company_id: row.id,
    //     movie_id: insertedMovie.id,
    //   }

    //   await runQuery('movie_production_companies', data)
    // })

    // preparedMovie.countries.forEach(async name => {
    //   const row = await findRow('countries', name)
    //   const data = {
    //     country_id: row.id,
    //     movie_id: insertedMovie.id,
    //   }

    //   await runQuery('movie_countries', data)
    // })

    // await addPeople(preparedMovie.director, 1)
    // await addPeople(preparedMovie.cast, 2)
    // await addPeople(preparedMovie.writer, 3)
    // await addPeople(preparedMovie.music, 4)

    // // IMAGES
    // const imageData = {
    //   movie_id: insertedMovie.id,
    //   backdrop: preparedMovie.images.backdrop || '',
    //   poster: preparedMovie.images.poster || '',
    // }

    // await runQuery('images', imageData)

    // // VIEWS
    // const viewData = {
    //   movie_id: insertedMovie.id,
    //   user_id: user.id,
    //   view_date: date || new Date(),
    // }

    // await runQuery('views', viewData)

    // return insertedMovie
  } catch (e) {
    throw new Error(e)
  }
}
