const { db, } = require('../../../adapters/db')

module.exports = async (_, { id, }) => {
  let whereUser = ''

  if (id) {
    whereUser = `WHERE id = ${id}`
  }

  const sql = `
    SELECT name, email, id FROM users
    ${whereUser}
  `

  try {
    return await db.query(sql)
  } catch (e) {
    throw new Error(e)
  }
}
