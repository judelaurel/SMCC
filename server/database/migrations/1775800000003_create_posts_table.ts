import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'posts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {

      table.increments('id').notNullable()
      table.uuid('uuid').notNullable().unique()

      table
        .integer('brand_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('brands')
        .onDelete('CASCADE')

      table.string('title', 255).notNullable()
      table.text('content').notNullable()
      
      table
        .string('state', 20)
        .notNullable()
        .defaultTo('draft')
        .checkIn(['draft', 'completed', 'achieved'])

      table
        .integer('created_by')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')

      table.boolean('is_ai_generated').notNullable().defaultTo(false)
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
