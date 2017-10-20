const { verifyToken } = require('../../../services/token')

module.exports = async (_, {}, { db, token }) => {
  try {
    const user = await verifyToken(token)
    const sql = `
      SELECT
        COUNT(distinct v.movie_id) AS total_views,
        COUNT(*) AS views_with_rewatches
      FROM views as v 
      WHERE v.user_id = ${user.id}
    `

    return await db.one(sql)
  } catch (e) {
    throw new Error(e)
  }
}
