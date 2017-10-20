exports.up = function (knex) {
  return knex.schema.table('movies', table => {
    table.boolean('adult').defaultTo(false)
    table.integer('budget').defaultTo(0)
    table.string('homepage').defaultTo('')
    table.float('popularity').defaultTo(0)
    table.integer('revenue').defaultTo(0)

    table.renameColumn('synopsis', 'overview')
  })
}

exports.down = function (knex) {
  return knex.schema.table('movies', table => {
    table.dropColumns('adult', 'budget', 'homepage', 'popularity', 'revenue')
    table.renameColumn('overview', 'synopsis')
  })
}
