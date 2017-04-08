const { db, pgp } = require('../../../adapters/db')

module.exports = async (_, { input }) => {
  try {
    const { movieId, userId, rating } = input
    const query = pgp.helpers.update({ rating }, ['rating'], 'ratings')

    return await db.one(`${query} WHERE user_id = ${userId} AND movie_id = ${movieId} RETURNING *`)
  } catch (e) {
    throw new Error(e)
  }
}
