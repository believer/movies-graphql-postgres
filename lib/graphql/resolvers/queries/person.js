const { db } = require('../../../adapters/db')
const { crewQuery, combineQuery } = require('../../../utils/helpers')

module.exports = async (_, { name, role }) => {
  const sql = `
    SELECT 
      distinct on (m.release_date) m.*, 
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
        FROM cast_and_crew AS cac
        INNER JOIN roles AS r ON cac.role_id = r.id 
        INNER JOIN people AS p ON cac.person_id = p.id 
        WHERE p.name = 'Emma Watson' AND r.role_name = 'actor'
      ) as p,
      LATERAL (
        SELECT * FROM movies WHERE id = p.movie_id
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
        m.release_date DESC;
  `

  try {
    return await db.query(sql)
  } catch (e) {
    throw new Error(e)
  }
}
