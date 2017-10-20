const { pgp } = require('../../../adapters/db')
const getMovie = require('../queries/movie')
const { verifyToken } = require('../../../services/token')

module.exports = async (_, { input }, { db, token }) => {
  try {
    const user = await verifyToken(token)
    const { movieId, rating } = input
    const query = pgp.helpers.update({ rating }, ['rating'], 'ratings')

    await db.one(
      `${query} WHERE user_id = ${user.id} AND movie_id = ${movieId} RETURNING *`
    )

    return await getMovie(null, { id: movieId })
  } catch (e) {
    throw new Error(e)
  }
}
