const { db } = require('../../../adapters/db')

module.exports = async (_, { userId, role, ranked, name }) => {
  let roleType
  let whereVar = ranked
  let where = 'WHERE ranked_people.ranking <= $3'

  if (name) {
    where = 'WHERE ranked_people.name = $3'
    whereVar = name
  }

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
                v.user_id = $1
                AND cac.role_id = $2
            GROUP BY 1
        ) as people
    ) as ranked_people
    ${where}
  `

  try {
    return await db.query(sql, [userId, roleType, whereVar])
  } catch (e) {
    throw new Error(e)
  }
}
