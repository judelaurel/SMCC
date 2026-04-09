import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('first_name').nullable()
      table.string('last_name').nullable()
      table.string('username', 50).notNullable().unique()
      table.string('email', 254).notNullable().unique()
      table.string('password').notNullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
      table.boolean('is_deleted').defaultTo(false)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}