const { verifyToken } = require('../../../services/token')

module.exports = async (_, {}, { db, token }) => {
  try {
    const user = await verifyToken(token)

    const sql = `
      SELECT 
        u.id,
        u.name,
        u.email
      FROM 
        friends AS f 
      INNER JOIN users AS u ON u.id = f.friend_id
      WHERE 
        user_id = ${user.id} 
    `

    return await db.query(sql)
  } catch (e) {
    throw new Error(e)
  }
}
