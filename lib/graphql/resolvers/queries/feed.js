const { movieLaterals, movieSelects } = require('../../../utils/helpers')
const { verifyToken } = require('../../../services/token')

module.exports = async (_, { limit, offset }, { db, token }) => {
  try {
    const user = await verifyToken(token)

    const sql = `
      SELECT 
        distinct on (m.id, v.view_date) m.*, 
        rate.rating,
        views.views,
        usr.user,
        ${movieSelects}
      FROM 
        (
          SELECT * 
          FROM views 
          WHERE user_id = ${user.id}
          ORDER BY view_date DESC
          OFFSET ${offset} 
          LIMIT ${limit}
        ) as v, 
        LATERAL (
          SELECT *,
          EXTRACT(YEAR FROM release_date) as year
          FROM movies WHERE id = v.movie_id
        ) as m, 
        LATERAL (
          SELECT
            jsonb_build_object(
              'id', id,
              'name', name,
              'email', email) as user
          FROM users WHERE id = v.user_id
        ) as usr,
        LATERAL (
          SELECT rating
          FROM ratings
          WHERE movie_id = v.movie_id
        ) as rate,
        LATERAL (
          SELECT 
          ARRAY (
            SELECT view_date 
            FROM views 
            WHERE 
              movie_id = v.movie_id 
              AND user_id = v.user_id
          ) as views
        ) as views, 
        ${movieLaterals}
      ORDER BY 
        v.view_date DESC
    `

    return await db.query(sql)
  } catch (e) {
    throw new Error(e)
  }
}
