const { findRoleId } = require('../../../utils/helpers')
const { verifyToken } = require('../../../services/token')

module.exports = async (_, { role }, { db, token }) => {
  try {
    const roleType = findRoleId(role)
    const user = await verifyToken(token)

    const sql = `
      SELECT
        COUNT(distinct p.name)
      FROM 
        views AS v
        INNER JOIN movies AS m ON m.id = v.movie_id
        INNER JOIN cast_and_crew AS cac ON cac.movie_id = m.id
        INNER JOIN people AS p ON cac.person_id = p.id
      WHERE v.user_id = ${user.id} AND cac.role_id = ${roleType}
    `

    const res = await db.one(sql)

    return res.count
  } catch (e) {
    throw new Error(e)
  }
}
