import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm';
import { DateTime } from 'luxon';
import User from '#models/user';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';
import Brand from './brand.ts';

export default class BrandMember extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare brandId: number;

  @column()
  declare userId: number;

  @column()
  declare role: 'owner' | 'admin' | 'member';

  @column()
  declare addedBy: number;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>;

  @belongsTo(() => User, { foreignKey: 'addedBy' })
  declare addedByUser: BelongsTo<typeof User>;

  @belongsTo(() => Brand)
  declare brand: BelongsTo<typeof Brand>;
}
