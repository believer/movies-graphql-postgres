const { db } = require('../../../adapters/db')

module.exports = async (_, { userId }) => {
  const sql = `
    SELECT
      all_views.minutes,
      all_views.minutes / 60 AS hours,
      all_views.minutes / (60 * 24) AS days,
      all_views.minutes / (60 * 24 * 365)::float AS years
    FROM (
      SELECT SUM(m.runtime) as minutes
      FROM views AS v 
      INNER JOIN movies AS m ON m.id = v.movie_id 
      WHERE v.user_id = ${userId}
    ) AS all_views;

    SELECT
      all_unique_views.minutes,
      all_unique_views.minutes / 60 AS hours,
      all_unique_views.minutes / (60 * 24) AS days,
      all_unique_views.minutes / (60 * 24 * 365)::float AS years
    FROM (
      SELECT SUM(unique_views.runtime) as minutes
      FROM (
        SELECT 
          distinct m.id, 
          m.runtime 
        FROM views AS V 
        INNER JOIN movies AS m ON m.id = v.movie_id 
        WHERE v.user_id = ${userId}
      ) as unique_views
    ) AS all_unique_views;
  `

  try {
    const [total_with_rewatches, total] = await db.query(sql)

    return {
      total_with_rewatches,
      total,
    }
  } catch (e) {
    throw new Error(e)
  }
}
