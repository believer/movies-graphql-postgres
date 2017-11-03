const knex = require('../../../adapters/knex')
const movie = require('../../../services/movie')
const { verifyToken } = require('../../../services/token')
const { upsert, addToMovieTable } = require('../../../utils/helpers')

module.exports = async (_, { input }, { db, token }) => {
  try {
    const { imdbId, rating, date, wilhelm } = input

    const user = await verifyToken(token)
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
      const parsedRating = parseInt(rating, 10)

      const ratingSql = `
        INSERT INTO ratings (movie_id, user_id, rating)
        VALUES ($1, $2, $3)
        ON CONFLICT
        ON CONSTRAINT ratings_pkey DO UPDATE SET rating=EXCLUDED.rating
      `

      await db.none(ratingSql, [insertedMovie.id, user.id, parsedRating])

      // const ratingQuery = knex('ratings').insert({
      //   movie_id: insertedMovie.id,
      //   user_id: user.id,
      //   rating: parsedRating,
      // })

      // console.log(parsedRating)

      // await knex.raw(
      //   '? ',
      //   [ratingQuery]
      // )
    }
    //#endregion

    //#region Images
    const imagesQuery = knex('images').insert({
      movie_id: insertedMovie.id,
      backdrop: preparedMovie.backdrop_path || '',
      poster: preparedMovie.poster_path || '',
    })

    await knex.raw('? ON CONFLICT DO NOTHING', [imagesQuery])
    //#endregion

    //#region Genres
    preparedMovie.genres.forEach(async name => {
      const id = await upsert('genres', name)

      await addToMovieTable('movie_genres', {
        movie_id: insertedMovie.id,
        genre_id: id,
      })
    })
    //#endregion

    //#region Languages
    preparedMovie.spoken_languages.forEach(async name => {
      const id = await upsert('languages', name)

      await addToMovieTable('movie_languages', {
        movie_id: insertedMovie.id,
        language_id: id,
      })
    })
    //#endregion

    //#region Production companies
    preparedMovie.production_companies.forEach(async name => {
      const id = await upsert('production_companies', name)

      await addToMovieTable('movie_production_companies', {
        movie_id: insertedMovie.id,
        production_company_id: id,
      })
    })
    //#endregion

    //#region Countries
    preparedMovie.production_countries.forEach(async name => {
      const id = await upsert('countries', name)

      await addToMovieTable('movie_countries', {
        movie_id: insertedMovie.id,
        country_id: id,
      })
    })
    //#endregion

    //#region Cast and crew
    const addPeople = async (people, role_id) => {
      people.forEach(async name => {
        const id = await upsert('people', name)

        await addToMovieTable('cast_and_crew', {
          role_id,
          movie_id: insertedMovie.id,
          person_id: id,
        })
      })
    }

    await addPeople(preparedMovie.director, 1)
    await addPeople(preparedMovie.cast, 2)
    await addPeople(preparedMovie.writer, 3)
    await addPeople(preparedMovie.music, 4)
    await addPeople(preparedMovie.producer, 5)
    //#endregion

    return insertedMovie
  } catch (e) {
    throw new Error(e)
  }
}
