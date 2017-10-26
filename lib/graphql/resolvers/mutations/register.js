const { db } = require('../../../adapters/db')
const { saltAndHashPassword } = require('../../../services/login')
const { validEmail } = require('../../../utils/validation')

module.exports = async (_, { input }) => {
  const { email, password, name } = input
  const { hashPassword, salt } = saltAndHashPassword(password)

  if (!validEmail(email)) throw new Error('Invalid email')
  if (password.length < 8) throw new Error('Passwords needs to be at least 8 characters')

  try {
    const user = await db.query(`SELECT * FROM users WHERE email = '${email}'`)

    if (user.length > 0) throw new Error('Invalid email')

    await db.query(`
      INSERT INTO users (password, name, email, salt) 
      VALUES ('${hashPassword}', '${name}', '${email}', '${salt}')
    `)

    return {
      email,
      name,
    }
  } catch (e) {
    throw new Error(e)
  }
}
