const { db } = require('../../../adapters/db')

module.exports = async (_, { rating }) => {
  const sql = `
    SELECT 
        m.*, 
        ra.rating 
    FROM 
        cast_and_crew AS cac 
        INNER JOIN roles AS r ON cac.role_id = r.id 
        INNER JOIN people AS p ON cac.person_id = p.id 
        INNER JOIN movies AS m ON cac.movie_id = m.id 
        INNER JOIN ratings AS ra ON ra.movie_id = m.id 
    WHERE 
        ra.rating = $1 
    GROUP BY 
        1, 
        ra.rating
    ORDER BY 
        m.release_date DESC
  `

  try {
    return await db.query(sql, [rating])
  } catch (e) {
    throw new Error(e)
  }
}
