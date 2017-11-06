module.exports = async (_, { limit, offset }, { db }) => {
  const sql = `
    SELECT 
      avg(r.rating) as average_rating, 
      count(r.rating) as number_of_ratings, 
      m.*,
      EXTRACT(YEAR FROM m.release_date) as year
    FROM ratings AS r 
    INNER JOIN movies AS m ON m.id = r.movie_id 
    GROUP BY m.id 
    ORDER BY
      number_of_ratings DESC,
      average_rating DESC,
      title ASC
    OFFSET ${offset}
    LIMIT ${limit}
  `

  try {
    return await db.query(sql)
  } catch (e) {
    throw new Error(e)
  }
}
