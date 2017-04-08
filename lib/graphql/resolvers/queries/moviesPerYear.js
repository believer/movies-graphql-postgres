const { db } = require('../../../adapters/db')

module.exports = async (_, { year }) => {
  let where = 'WHERE m.release_date IS NOT NULL'

  if (year) {
    where = `${where} AND year = $1`
  }

  const sql = `
    SELECT
      extract(year from m.release_date) as year,
      COUNT(extract(year from m.release_date))
    FROM movies as m
    ${where}
    GROUP by 1
    ORDER BY year DESC
  `

  try {
    return await db.query(sql, [year])
  } catch (e) {
    throw new Error(e)
  }
}
