exports.up = knex => {
  return knex.schema.createTableIfNotExists('friends', table => {
    table.increments()
    table.string('user_id').notNullable()
    table.string('friend_id').notNullable()
  })
}

exports.down = knex => {
  return knex.schema.dropTableIfExists('friends')
}
