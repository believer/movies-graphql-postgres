const { verifyToken } = require('../../../services/token')

module.exports = async (_, {}, { db, token }) => {
  try {
    const user = await verifyToken(token)

    const sql = `
      SELECT
        extract(year from v.view_date) as year,
        COUNT(extract(year from v.view_date))
      FROM views as v 
      WHERE v.user_id = ${user.id}
      GROUP by 1
      ORDER BY year DESC
    `

    return await db.query(sql)
  } catch (e) {
    throw new Error(e)
  }
}
