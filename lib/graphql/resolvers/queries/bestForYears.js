const { db } = require('../../../adapters/db')

module.exports = async (_, { userId, ranking }) => {
  const sql = `
    SELECT * FROM (
      SELECT 
          m.title,
          m.release_date,
          r.rating,
          row_number() OVER (PARTITION BY date_part('year', release_date) ORDER BY rating DESC) AS ranking
      FROM 
          movies AS m 
          INNER JOIN ratings AS r ON r.movie_id = m.id
          WHERE r.user_id = ${userId}
    ) ratings
    WHERE ratings.ranking = ${ranking} AND ratings.release_date IS NOT NULL
    ORDER BY release_date DESC
  `

  try {
    return await db.query(sql)
  } catch (e) {
    throw new Error(e)
  }
}
