import { DateTime } from 'luxon';
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';
import SocialAccount from '#models/social_account';
import Post from '#models/post';

export default class ScheduledPost extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare socialAccountId: number;

  @column()
  declare postId: number;

  @column()
  declare postType: 'text' | 'link' | 'image';

  @column.dateTime()
  declare scheduledAt: DateTime;

  @column.dateTime()
  declare publishedAt: DateTime | null;

  @column()
  declare publishStatus:
    | 'pending'
    | 'processing'
    | 'posted'
    | 'failed'
    | 'cancelled';

  @column()
  declare errorMessage: string | null;

  @column()
  declare retryCount: number;

  @column.dateTime()
  declare lastAttemptAt: DateTime | null;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null;

  @belongsTo(() => SocialAccount)
  declare socialAccount: BelongsTo<typeof SocialAccount>;

  @belongsTo(() => Post)
  declare post: BelongsTo<typeof Post>;
}
