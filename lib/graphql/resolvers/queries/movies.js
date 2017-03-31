const db = require('../../../adapters/db')

module.exports = async (_, { id }) => {
  let whereID = ''

  if (id) {
    whereID = 'WHERE m.id = $1'
  }

  if (id && id.indexOf('tt') > -1) {
    whereID = 'WHERE m.imdb_id = $1'
  }

  const sql = `
    SELECT
      m.id,
      m.title,
      m.tagline,
      m.imdb_id,
      m.tmdb_id,
      m.synopsis,
      m.runtime,
      m.year,
      string_agg(distinct img.poster, ',') as poster,
      string_agg(distinct img.backdrop, ',') as backdrop,
      array_remove(array_agg(distinct CASE WHEN r.role_name = 'actor' THEN p.name END), NULL) as actors,
      array_remove(array_agg(distinct CASE WHEN r.role_name = 'director' THEN p.name END), NULL) as directors,
      array_remove(array_agg(distinct CASE WHEN r.role_name = 'composer' THEN p.name END), NULL) as composers,
      array_remove(array_agg(distinct CASE WHEN r.role_name = 'writer' THEN p.name END), NULL) as writers,
      array_agg(distinct g.name) as genres,
      array_agg(distinct c.name) as countries,
      array_agg(distinct l.name) as languages,
      array_agg(distinct pc.name) as production_companies
    FROM movies AS m
    INNER JOIN cast_and_crew AS cac ON m.id = cac.movie_id
    INNER JOIN people AS p ON p.id = cac.person_id
    INNER JOIN roles AS r ON r.id = cac.role_id
    INNER JOIN movie_genres AS mg ON mg.movie_id = m.id
    INNER JOIN genres AS g ON g.id = mg.genre_id
    INNER JOIN movie_countries AS mc ON mc.movie_id = m.id
    INNER JOIN countries AS c ON c.id = mc.country_id
    INNER JOIN movie_languages AS ml ON ml.movie_id = m.id
    INNER JOIN languages AS l ON l.id = ml.language_id
    INNER JOIN movie_production_companies AS mpc ON mpc.movie_id = m.id
    INNER JOIN production_companies AS pc ON pc.id = mpc.production_company_id
    INNER JOIN images as img ON img.movie_id = m.id
    ${whereID}
    GROUP BY 1
    LIMIT 50;
  `

  try {
    return await db.query(sql, [id])
  } catch (e) {
    throw new Error(e)
  }
}
