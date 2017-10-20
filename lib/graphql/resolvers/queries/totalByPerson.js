const { findRoleId } = require('../../../utils/helpers')
const { verifyToken } = require('../../../services/token')

module.exports = async (_, { role, ranked, name }, { db, token }) => {
  try {
    const user = await verifyToken(token)
    const roleType = findRoleId(role)

    let whereVar = ranked
    let where = 'WHERE ranked_people.ranking <= $1'

    if (name) {
      where = 'WHERE ranked_people.name = $1'
      whereVar = name
    }

    const sql = `
    SELECT * FROM (
      SELECT 
        people.name,
        people.number_of_movies,
        row_number() OVER (ORDER BY people.number_of_movies DESC) as ranking
      FROM 
        (
          SELECT 
            p.name,
            COUNT(p.name) as number_of_movies
          FROM 
            views AS v 
            INNER JOIN movies AS m ON m.id = v.movie_id 
            INNER JOIN cast_and_crew AS cac ON cac.movie_id = m.id 
            INNER JOIN people AS p ON cac.person_id = p.id 
          WHERE 
            v.user_id = ${user.id}
            AND cac.role_id = ${roleType}
          GROUP BY 1
        ) as people
    ) as ranked_people
    ${where}
  `

    return await db.query(sql, [whereVar])
  } catch (e) {
    throw new Error(e)
  }
}
