const { db } = require('../../../adapters/db')

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
          SELECT 
              * 
          FROM 
              views 
          ${whereUser}
          ORDER BY 
              view_date DESC OFFSET 0 
          LIMIT 
              50
      ) as v, 
      LATERAL (
          SELECT 
              * 
          FROM 
              movies 
          WHERE 
              id = v.movie_id
      ) as m, 
      LATERAL (
          SELECT 
              * 
          FROM 
              images 
          WHERE 
              movie_id = m.id
      ) as img, 
      LATERAL (
          SELECT 
              ARRAY (
                  SELECT 
                      g.name 
                  FROM 
                      movie_genres AS mg 
                      INNER JOIN genres AS g ON g.id = mg.genre_id 
                  WHERE 
                      mg.movie_id = m.id
              ) as genres
      ) as g, 
      LATERAL (
          SELECT 
              ARRAY (
                  SELECT 
                      c.name 
                  FROM 
                      movie_countries AS mc 
                      INNER JOIN countries AS c ON c.id = mc.country_id 
                  WHERE 
                      mc.movie_id = m.id
              ) as countries
      ) as c, 
      LATERAL (
          SELECT 
              ARRAY (
                  SELECT 
                      l.name 
                  FROM 
                      movie_languages AS ml 
                      INNER JOIN languages AS l ON l.id = ml.language_id 
                  WHERE 
                      ml.movie_id = m.id
              ) as languages
      ) as l, 
      LATERAL (
          SELECT 
              ARRAY (
                  SELECT 
                      pc.name 
                  FROM 
                      movie_production_companies AS mpc 
                      INNER JOIN production_companies AS pc ON pc.id = mpc.production_company_id 
                  WHERE 
                      mpc.movie_id = m.id
              ) as production_companies
      ) as pc, 
      LATERAL (
          SELECT 
              ARRAY (
                  SELECT 
                      trim(p.name) 
                  FROM 
                      cast_and_crew AS cac 
                      INNER JOIN people AS p ON p.id = cac.person_id 
                  WHERE 
                      cac.movie_id = m.id 
                      AND cac.role_id = 2
              ) as actors
      ) as a, 
      LATERAL (
          SELECT 
              ARRAY (
                  SELECT 
                      trim(p.name) 
                  FROM 
                      cast_and_crew AS cac 
                      INNER JOIN people AS p ON p.id = cac.person_id 
                  WHERE 
                      cac.movie_id = m.id 
                      AND cac.role_id = 1
              ) as directors
      ) as d, 
      LATERAL (
          SELECT 
              ARRAY (
                  SELECT 
                      trim(p.name) 
                  FROM 
                      cast_and_crew AS cac 
                      INNER JOIN people AS p ON p.id = cac.person_id 
                  WHERE 
                      cac.movie_id = m.id 
                      AND cac.role_id = 3
              ) as writers
      ) as w, 
      LATERAL (
          SELECT 
              ARRAY (
                  SELECT 
                      trim(p.name) 
                  FROM 
                      cast_and_crew AS cac 
                      INNER JOIN people AS p ON p.id = cac.person_id 
                  WHERE 
                      cac.movie_id = m.id 
                      AND cac.role_id = 4
              ) as composers
      ) as co 
    ORDER BY 
      v.view_date DESC
  `

  try {
    return await db.query(sql)
  } catch (e) {
    throw new Error(e)
  }
}
