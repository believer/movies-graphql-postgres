const { db } = require('../../../adapters/db')

module.exports = async (_, { userId }) => {
  const sql = `
    SELECT
      COUNT(distinct v.movie_id) as views_with_rewatches,
      COUNT(*) as total_views
    FROM views as v 
    WHERE v.user_id = $1
  `

  try {
    const res = await db.query(sql, [userId])
    
    return res[0]
  } catch (e) {
    throw new Error(e)
  }
}
