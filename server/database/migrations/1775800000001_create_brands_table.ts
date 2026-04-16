import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'brands'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.uuid('uuid').notNullable().unique()
      table.string('name', 100).notNullable()
      table.text('description').nullable()
      table
        .string('tone_of_voice', 20)
        .notNullable()
        .defaultTo('professional')
        .checkIn(['professional', 'casual', 'witty', 'formal'])
      table.string('logo_url').nullable()
      table.string('primary_color', 7).nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
