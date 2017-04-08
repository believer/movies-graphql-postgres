const { db } = require('../../../adapters/db')

module.exports = async (_, { id }) => {
  let whereUser = ''

  if (id) {
    whereUser = 'WHERE id = $1'
  }

  const sql = `
    SELECT 
        name,
        email,
        id
    FROM 
        users
    ${whereUser}
  `

  try {
    return await db.query(sql, [id])
  } catch (e) {
    throw new Error(e)
  }
}
