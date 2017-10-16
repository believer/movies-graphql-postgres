const { db } = require('../../../adapters/db')
const { invalidPassword } = require('../../../services/login')

module.exports = async (_, { input }) => {
  try {
    const { username, password } = input

    const user = await db.one(
      `SELECT * FROM users WHERE email = '${username}'`
    )

    if (invalidPassword(password, user.password, user.salt)) {
      throw new Error('Wrong username or password')
    }

    return user
  } catch (e) {
    if (e.message === 'No data returned from the query.') {
      throw new Error('Wrong username or password')
    }

    throw new Error(e)
  }
}
