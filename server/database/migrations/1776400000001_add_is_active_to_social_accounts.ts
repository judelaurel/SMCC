import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'social_accounts';

  async up() {
    this.schema.alterTable(this.tableName, table => {
      table.boolean('is_active').notNullable().defaultTo(true).after('scope');
    });
  }

  async down() {
    this.schema.alterTable(this.tableName, table => {
      table.dropColumn('is_active');
    });
  }
}
