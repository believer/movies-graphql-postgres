exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('movies', table => {
    table.increments()
    table.string('imdb_id')
    table.date('release_date')
    table.integer('runtime')
    table.text('synopsis')
    table.text('tagline')
    table.string('title').notNullable()
    table.string('tmdb_id')
    table.string('year')
    table.boolean('wilhelm')
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('movies')
}
