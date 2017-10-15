const { db } = require('../../../adapters/db')

module.exports = async (_, { userId }) => {
  const sql = `
    SELECT
      COUNT(distinct v.movie_id) AS total_views,
      COUNT(*) AS views_with_rewatches
    FROM views as v 
    WHERE v.user_id = ${userId}
  `

  try {
    return await db.one(sql)
  } catch (e) {
    throw new Error(e)
  }
}
