const { db, } = require('../../../adapters/db')

module.exports = async (_, { userId, offset, limit, }) => {
  let whereUser = ''

  if (userId) {
    whereUser = `WHERE v.user_id = ${userId}`
  }

  const sql = `
    SELECT
        seen.id as movie_id,
        seen.title,
        json_agg(json_build_object('date', seen.view_date, 'userId', seen.user_id)) as dates,
        COUNT(seen.view_date) as views_count
    FROM (
      SELECT 
        m.id,
        m.title,
        v.view_date,
        v.user_id
      FROM 
          movies AS m
          INNER JOIN views AS v ON v.movie_id = m.id
      ${whereUser}
      ORDER BY m.id, v.view_date DESC
    ) as seen
    GROUP BY id, title
    ORDER BY views_count DESC, title ASC
    OFFSET ${offset}
    LIMIT ${limit}
  `

  try {
    return await db.query(sql)
  } catch (e) {
    throw new Error(e)
  }
}
