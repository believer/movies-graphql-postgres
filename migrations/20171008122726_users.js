exports.up = (knex, Promise) => {
  return knex.schema.createTableIfNotExists('users', table => {
    table.increments()
    table.string('email').notNullable()
    table.string('name').notNullable()
    table
      .string('password')
      .unique()
      .notNullable()
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTableIfExists('users')
}
