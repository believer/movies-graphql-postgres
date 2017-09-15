const { db } = require('../../../adapters/db')
const { movieLaterals, movieSelects } = require('../../../utils/helpers')

module.exports = async (_, { rating }) => {
  const sql = `
    SELECT 
      distinct on (m.release_date) m.*, 
      ${movieSelects} 
    FROM 
      (
        SELECT  * 
        FROM ratings AS r
        WHERE rating = ${rating}
      ) as p,
      LATERAL (
        SELECT * FROM movies WHERE id = p.movie_id
      ) as m, 
      ${movieLaterals}
    ORDER BY 
        m.release_date DESC;
  `

  try {
    return await db.query(sql)
  } catch (e) {
    throw new Error(e)
  }
}
