const nconf = require('nconf')
const jwt = require('jsonwebtoken')

nconf.env({ lowerCase: true }).file({ file: `${process.cwd()}/config.json` })

function issueToken (user) {
  const data = {
    data: {
      user,
    },
  }

  const settings = {
    algorithm: 'HS512',
    expiresIn: '1h',
  }

  return jwt.sign(data, nconf.get('jwt:secret'), settings)
}

async function verifyToken (token) {
  if (!token) {
    throw new Error('No token provided')
  }

  try {
    const decoded = jwt.verify(
      token.replace('Bearer ', ''),
      nconf.get('jwt:secret')
    )
    return decoded.data.user
  } catch (err) {
    throw new Error(err)
  }
}

module.exports = {
  issueToken,
  verifyToken,
}
