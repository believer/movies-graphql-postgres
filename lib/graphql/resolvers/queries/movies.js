const db = require('../../../adapters/db')

module.exports = async (_, { id, limit, offset }) => {
  let whereID = ''

  if (id) {
    whereID = 'WHERE m.id = $1'
  }

  if (id && id.indexOf('tt') > -1) {
    whereID = 'WHERE m.imdb_id = $1'
  }

  const roles = [
    'actor',
    'composer',
    'director',
    'writer'
  ]

  const roleAggregates = roles.map(role => {
    return `
      array_remove(
          array_agg(
              distinct CASE WHEN r.role_name = '${role}' THEN p.name END
          ), 
          NULL
      ) as ${role}s`
  }).join(',')

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
        m.wilhelm,
        avg(rates.rating) as average_rating, 
        array_agg(distinct rates.rating) as users_ratings, 
        array_agg(distinct u.email) as users_viewed, 
        string_agg(distinct img.poster, ',') as poster, 
        string_agg(distinct img.backdrop, ',') as backdrop, 
        ${roleAggregates}, 
        array_agg(distinct g.name) as genres, 
        array_agg(distinct c.name) as countries, 
        array_agg(distinct l.name) as languages, 
        array_agg(distinct pc.name) as production_companies 
    FROM 
        movies AS m 
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
        INNER JOIN views as v ON v.movie_id = m.id
        INNER JOIN users as u ON u.id = v.user_id
        INNER JOIN ratings as rates ON rates.movie_id = m.id
    ${whereID}
    GROUP BY 
        1 
    OFFSET
        ${offset}
    LIMIT 
        ${limit};
  `

  try {
    return await db.query(sql, [id])
  } catch (e) {
    throw new Error(e)
  }
}
