const { db } = require('../../../adapters/db')
const { crewQuery, combineQuery } = require('../../../utils/helpers')

module.exports = async (_, { movieId, limit, offset }) => {
  let whereID = ''

  if (movieId) {
    whereID = 'WHERE id = $1'
  }

  if (movieId && movieId.indexOf('tt') > -1) {
    whereID = 'WHERE imdb_id = $1'
  }

  const sql = `
    SELECT 
      m.*, 
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
        SELECT * FROM movies ${whereID}
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
  `

  try {
    return await db.query(sql, [movieId])
  } catch (e) {
    throw new Error(e)
  }
}
