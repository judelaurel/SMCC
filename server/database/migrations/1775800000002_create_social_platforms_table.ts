import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'social_platforms'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table
        .integer('brand_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('brands')
        .onDelete('CASCADE')
      table
        .string('platform', 20)
        .notNullable()
        .checkIn(['instagram', 'twitter', 'linkedin', 'tiktok', 'facebook'])
      table.boolean('is_active').notNullable().defaultTo(true)
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.unique(['brand_id', 'platform'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
