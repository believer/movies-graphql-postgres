const { saltAndHashPassword } = require('../../../services/login')
const { validEmail } = require('../../../utils/validation')

module.exports = async (_, { input }, { db }) => {
  const { email, password, name } = input
  const { hashPassword, salt } = saltAndHashPassword(password)
  const prettyEmail = email.trim().toLowerCase()

  if (!validEmail(prettyEmail)) throw new Error('Invalid email')
  if (password.length < 8) throw new Error('Passwords needs to be at least 8 characters')

  try {
    const user = await db.query(`SELECT * FROM users WHERE email = '${prettyEmail}'`)

    if (user.length > 0) throw new Error('Invalid email')

    await db.query(`
      INSERT INTO users (password, name, email, salt)
      VALUES ('${hashPassword}', '${name}', '${prettyEmail}', '${salt}')
    `)

    return {
      email: prettyEmail,
      name,
    }
  } catch (e) {
    throw new Error(e)
  }
}
