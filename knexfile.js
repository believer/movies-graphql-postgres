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
}
