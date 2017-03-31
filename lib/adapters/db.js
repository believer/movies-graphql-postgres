const pgp = require('simple-pg')()
const db = pgp({
  user: 'api',
  password: 'movies',
  database: 'movee',
  host: 'localhost',
  port: 5432,
  timeout: 30000
})

module.exports = db
