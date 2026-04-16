import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'scheduled_posts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()

      table
        .integer('social_account_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('social_accounts')
        .onDelete('CASCADE')

      table
        .integer('post_id')
        .nullable()
        .unsigned()
        .references('id')
        .inTable('posts')
        .onDelete('CASCADE')

      table.string('post_type').defaultTo('text')

      table.timestamp('scheduled_at').notNullable()
      table.timestamp('published_at').nullable()

      table
        .enu('publish_status', ['pending', 'processing', 'posted', 'failed', 'cancelled'])
        .defaultTo('pending')

      table.text('error_message').nullable()

      table.integer('retry_count').defaultTo(0)
      table.timestamp('last_attempt_at').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}