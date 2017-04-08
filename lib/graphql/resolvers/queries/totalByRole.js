const { db } = require('../../../adapters/db')

module.exports = async (_, { userId, role }) => {
  let roleType

  switch (role) {
    case 'director':
      roleType = 1
      break
    case 'actor':
      roleType = 2
      break
    case 'writer':
      roleType = 3
      break
    case 'composer':
      roleType = 4
      break
  }

  const sql = `
    SELECT
      COUNT(distinct p.name)
    FROM 
        views AS v
        INNER JOIN movies AS m ON m.id = v.movie_id
        INNER JOIN cast_and_crew AS cac ON cac.movie_id = m.id
        INNER JOIN people AS p ON cac.person_id = p.id
    WHERE v.user_id = $1 AND cac.role_id = $2
  `

  try {
    const res = await db.query(sql, [userId, roleType])
    return res[0].count
  } catch (e) {
    throw new Error(e)
  }
}
