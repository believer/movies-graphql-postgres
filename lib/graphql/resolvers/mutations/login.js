const { invalidPassword } = require('../../../services/login')
const { issueToken } = require('../../../services/token')

module.exports = async (_, { input }, { db }) => {
  try {
    const { username, password } = input

    const user = await db.one(`SELECT * FROM users WHERE email = '${username}'`)

    if (invalidPassword(password, user.password, user.salt)) {
      throw new Error('Wrong username or password')
    }

    return {
      token: issueToken({
        name: user.name,
        email: user.email,
        id: user.id,
      }),
    }
  } catch (e) {
    if (e.message === 'No data returned from the query.') {
      throw new Error('Wrong username or password')
    }

    throw new Error(e)
  }
}
