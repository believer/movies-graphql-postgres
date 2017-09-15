const { db } = require('../../../adapters/db')

module.exports = async (_, { name, role }) => {
  const sql = `
    SELECT 
        m.* 
    FROM 
        cast_and_crew AS cac 
        INNER JOIN roles AS r ON cac.role_id = r.id 
        INNER JOIN people AS p ON cac.person_id = p.id 
        INNER JOIN movies AS m ON cac.movie_id = m.id 
    WHERE 
        r.role_name = '${role}'
        AND p.name LIKE '%${name}%'
    ORDER BY 
        release_date DESC;
  `

  try {
    return await db.query(sql)
  } catch (e) {
    throw new Error(e)
  }
}
