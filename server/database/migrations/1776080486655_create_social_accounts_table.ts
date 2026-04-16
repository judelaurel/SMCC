import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'social_accounts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()

      table
        .integer('user_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')

      table
        .integer('platform_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('social_platforms')
        .onDelete('CASCADE')

      table.string('provider_user_id').notNullable()
      table.string('username').notNullable()

      table.text('access_token').notNullable()
      table.text('refresh_token').nullable()
      table.timestamp('expires_at', { useTz: true }).nullable()

      table.string('scope').nullable()

      table.unique(['user_id', 'platform_id'])

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}