const { movieLaterals, movieSelects } = require('../../../utils/helpers')

module.exports = async (_, { userId, limit, offset }, { db }) => {
  let whereUser = ''

  if (userId) {
    whereUser = `WHERE user_id = ${userId}`
  }

  const sql = `
    SELECT 
      distinct on (m.id, v.view_date) m.*, 
      usr.user,
      ${movieSelects}
    FROM 
      (
        SELECT  * 
        FROM views 
        ${whereUser}
        ORDER BY view_date DESC
        OFFSET ${offset} 
        LIMIT ${limit}
      ) as v, 
      LATERAL (
        SELECT * FROM movies WHERE id = v.movie_id
      ) as m, 
      LATERAL (
        SELECT
          jsonb_build_object(
            'id', id,
            'name', name,
            'email', email) as user
        FROM users WHERE id = v.user_id
      ) as usr,
      ${movieLaterals}
    ORDER BY 
      v.view_date DESC
  `

  try {
    return await db.query(sql)
  } catch (e) {
    throw new Error(e)
  }
}
