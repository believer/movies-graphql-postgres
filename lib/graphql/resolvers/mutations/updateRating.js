const db = require('../../../adapters/db')

module.exports = async (_, { input }) => {
  const { movieId, userId, rating } = input

  const update = {
    movie_id: movieId,
    rating
  }

  try {
    const response = await db.update('ratings', 'movie_id', update, {
      user_id: userId,
      movie_id: movieId
    })
    
    return response
  } catch (e) {
    throw new Error(e)
  }
}
