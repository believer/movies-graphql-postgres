const { db } = require('../../../adapters/db')
const { movieLaterals, movieSelects } = require('../../../utils/helpers')

module.exports = async (_, { movieId, limit, offset }) => {
  let whereID = ''

  if (movieId) {
    whereID = 'WHERE id = $1'
  }

  if (movieId && movieId.indexOf('tt') > -1) {
    whereID = 'WHERE imdb_id = $1'
  }

  const sql = `
    SELECT 
      m.*, 
      ${movieSelects}
    FROM 
      (
        SELECT * FROM movies ${whereID}
      ) as m, 
      ${movieLaterals}
  `

  try {
    return await db.query(sql, [movieId])
  } catch (e) {
    throw new Error(e)
  }
}
