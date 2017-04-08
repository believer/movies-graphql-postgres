const pgp = require('pg-promise')()
const db = pgp({
  user: process.env.DB_USER || 'api',
  password: process.env.DB_PASSWORD || 'movies',
  database: process.env.DB_DATABASE || 'movee',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  timeout: 30000
})

module.exports = {
  db,
  pgp
}
