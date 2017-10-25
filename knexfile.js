module.exports = {
  development: {
    client: 'pg',
    connection: {
      user: 'api',
      database: 'movee',
      password: 'movies',
    },
    migrations: {
      directory: __dirname + '/migrations',
    },
  },
  production: {
    client: 'pg',
    connection: {
      user: process.env.DB_USER,
      database: process.env.DB_DATABASE,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
    },
    migrations: {
      directory: __dirname + '/migrations',
    },
  },
}
