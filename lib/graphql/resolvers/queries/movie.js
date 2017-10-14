const { db, } = require('../../../adapters/db')
const { movieLaterals, movieSelects, } = require('../../../utils/helpers')

module.exports = async (_, { id, }) => {
  let whereID = 'WHERE id = $1'

  if (id && id.indexOf('tt') > -1) {
    whereID = 'WHERE imdb_id = $1'
  }

  const sql = `
    SELECT 
      m.*, 
      ${movieSelects}
    FROM 
      (
        SELECT * FROM movies ${whereID}
      ) as m, 
      ${movieLaterals}
  `

  try {
    return await db.one(sql, [id,])
  } catch (e) {
    return null
  }
}
