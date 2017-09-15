const { db } = require('../../../adapters/db')
const { findRoleId } = require('../../../utils/helpers')

module.exports = async (_, { userId, role }) => {
  const roleType = findRoleId(role)

  const sql = `
    SELECT
      COUNT(distinct p.name)
    FROM 
      views AS v
      INNER JOIN movies AS m ON m.id = v.movie_id
      INNER JOIN cast_and_crew AS cac ON cac.movie_id = m.id
      INNER JOIN people AS p ON cac.person_id = p.id
    WHERE v.user_id = ${userId} AND cac.role_id = ${roleType}
  `

  try {
    const res = await db.query(sql)
    return res[0].count
  } catch (e) {
    throw new Error(e)
  }
}
