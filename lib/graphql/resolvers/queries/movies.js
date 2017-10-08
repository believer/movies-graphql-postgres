const { db } = require('../../../adapters/db')
const { movieLaterals, movieSelects } = require('../../../utils/helpers')

module.exports = async (_, { limit, offset }) => {
  const sql = `
    SELECT 
      m.*, 
      ${movieSelects}
    FROM 
      (
        SELECT *
        FROM movies
        OFFSET ${offset}
        LIMIT ${limit}
      ) as m, 
      ${movieLaterals}
  `

  try {
    return await db.query(sql)
  } catch (e) {
    throw new Error(e)
  }
}
