const { db, pgp } = require('../../../adapters/db')
const getMovie = require('../queries/movie')

module.exports = async (_, { input }) => {
  try {
    const { movieId, userId, rating } = input
    const query = pgp.helpers.update({ rating }, ['rating'], 'ratings')

    await db.one(
      `${query} WHERE user_id = ${userId} AND movie_id = ${movieId} RETURNING *`
    )

    return await getMovie(null, { id: movieId })
  } catch (e) {
    throw new Error(e)
  }
}
