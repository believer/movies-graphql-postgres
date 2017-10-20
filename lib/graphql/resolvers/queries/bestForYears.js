const { verifyToken } = require('../../../services/token')

module.exports = async (_, { ranking }, { db, token }) => {
  try {
    const user = await verifyToken(token)

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
          WHERE r.user_id = ${user.id}
      ) ratings
      WHERE ratings.ranking = ${ranking} AND ratings.release_date IS NOT NULL
      ORDER BY release_date DESC
    `

    return await db.query(sql)
  } catch (e) {
    throw new Error(e)
  }
}
