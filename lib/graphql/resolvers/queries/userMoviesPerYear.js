const { db } = require('../../../adapters/db')

module.exports = async (_, { userId }) => {
  const sql = `
    SELECT
      extract(year from v.view_date) as year,
      COUNT(extract(year from v.view_date))
    FROM views as v 
    WHERE v.user_id = $1
    GROUP by 1
    ORDER BY year DESC
  `

  try {
    return await db.query(sql, [userId])
  } catch (e) {
    throw new Error(e)
  }
}
