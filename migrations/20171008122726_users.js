exports.up = knex => {
  return knex.schema.createTableIfNotExists('users', table => {
    table.increments()
    table.string('email').notNullable()
    table.string('name').notNullable()
    table
      .string('password')
      .unique()
      .notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

exports.down = knex => {
  return knex.schema.dropTableIfExists('users')
}
