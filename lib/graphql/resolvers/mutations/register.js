// const { db } = require('../../../adapters/db')
const { saltAndHashPassword } = require('../../../services/login')

module.exports = async (_, { input }) => {
  try {
    const { email, password, name } = input

    console.log(saltAndHashPassword(password))
    // Insert ti DB name, email, password, salt, created and updated date

    return {
      email,
      name,
    }
  } catch (e) {
    throw new Error(e)
  }
}
