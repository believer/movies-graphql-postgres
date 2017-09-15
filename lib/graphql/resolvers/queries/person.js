const { db } = require('../../../adapters/db')
const { movieLaterals, movieSelects } = require('../../../utils/helpers')

module.exports = async (_, { name, role }) => {
  const sql = `
    SELECT 
      distinct on (m.release_date) m.*, 
      ${movieSelects} 
    FROM 
      (
        SELECT  * 
        FROM cast_and_crew AS cac
        INNER JOIN roles AS r ON cac.role_id = r.id 
        INNER JOIN people AS p ON cac.person_id = p.id 
        WHERE
          r.role_name = '${role}' AND p.name LIKE '%${name}%'
      ) as p,
      LATERAL (
        SELECT * FROM movies WHERE id = p.movie_id
      ) as m, 
      ${movieLaterals}
    ORDER BY 
        m.release_date DESC;
  `

  try {
    return await db.query(sql)
  } catch (e) {
    throw new Error(e)
  }
}
