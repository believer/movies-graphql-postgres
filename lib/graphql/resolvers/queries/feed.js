const { db } = require('../../../adapters/db')

module.exports = async (_, { userId }) => {
  let whereUser = ''

  if (userId) {
    whereUser = `WHERE v.user_id = ${userId}`
  }

  const sql = `
    SELECT 
        m.*, 
        v.view_date, 
        u.email as user_email, 
        u.id as user_id, 
        r.rating 
    FROM 
        views AS v 
        INNER JOIN movies AS m ON m.id = v.movie_id 
        INNER JOIN users AS u ON u.id = v.user_id 
        INNER JOIN ratings AS r ON m.id = r.movie_id 
        AND u.id = r.user_id 
    ${whereUser}
    ORDER BY 
        v.view_date DESC 
    LIMIT 
        50;
  `

  try {
    return await db.query(sql)
  } catch (e) {
    throw new Error(e)
  }
}
