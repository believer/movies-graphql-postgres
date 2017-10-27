exports.up = knex => {
  return knex.schema.createTableIfNotExists('friends', table => {
    table.increments()
    table.integer('user_id').notNullable()
    table.integer('friend_id').notNullable()
  })
}

exports.down = knex => {
  return knex.schema.dropTableIfExists('friends')
}
