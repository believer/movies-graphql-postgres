const { db } = require('../../../adapters/db')
const { crewQuery, combineQuery } = require('../../../utils/helpers')

module.exports = async (_, { userId }) => {
  let whereUser = ''

  if (userId) {
    whereUser = `WHERE user_id = ${userId}`
  }

  const sql = `
    SELECT 
      distinct on (m.id, v.view_date) m.*, 
      img.poster, 
      img.backdrop, 
      a.actors, 
      d.directors,
      co.composers, 
      w.writers,
      g.genres, 
      c.countries, 
      l.languages, 
      pc.production_companies 
    FROM 
      (
        SELECT  * 
        FROM views 
        ${whereUser}
        ORDER BY view_date DESC
        OFFSET 0 
        LIMIT 50
      ) as v, 
      LATERAL (
        SELECT * FROM movies WHERE id = v.movie_id
      ) as m, 
      LATERAL (
        SELECT * FROM images WHERE movie_id = m.id
      ) as img, 
      ${combineQuery('genre', 'genres', 'g')},
      ${combineQuery('country', 'countries', 'c')},
      ${combineQuery('language', 'languages', 'l')},
      ${combineQuery('production_company', 'production_companies', 'pc')},
      ${crewQuery(1, 'directors', 'd')},
      ${crewQuery(2, 'actors', 'a')},
      ${crewQuery(3, 'writers', 'w')},
      ${crewQuery(4, 'composers', 'co')}
    ORDER BY 
      v.view_date DESC
  `

  try {
    return await db.query(sql)
  } catch (e) {
    throw new Error(e)
  }
}
