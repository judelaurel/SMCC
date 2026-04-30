import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'scheduled_posts';

  async up() {
    this.schema.alterTable(this.tableName, table => {
      table.text('title').nullable().defaultTo(null);
    });
  }

  async down() {
    this.schema.alterTable(this.tableName, table => {
      table.dropColumn('title');
    });
  }
}
