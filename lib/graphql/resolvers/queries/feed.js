const { db } = require('../../../adapters/db')
const { movieLaterals, movieSelects } = require('../../../utils/helpers')

module.exports = async (_, { userId }) => {
  let whereUser = ''

  if (userId) {
    whereUser = `WHERE user_id = ${userId}`
  }

  const sql = `
    SELECT 
      distinct on (m.id, v.view_date) m.*, 
      ${movieSelects}
    FROM 
      (
        SELECT  * 
        FROM views 
        ${whereUser}
        ORDER BY view_date DESC
        OFFSET 0 
        LIMIT 50
      ) as v, 
      LATERAL (
        SELECT * FROM movies WHERE id = v.movie_id
      ) as m, 
      ${movieLaterals}
    ORDER BY 
      v.view_date DESC
  `

  try {
    return await db.query(sql)
  } catch (e) {
    throw new Error(e)
  }
}
