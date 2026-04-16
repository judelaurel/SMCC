import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import SocialPlatform from '#models/social_platform'
import ScheduledPost from '#models/scheduled_post'

export default class SocialAccount extends BaseModel {

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare platformId: number

  @column()
  declare providerUserId: string

  @column()
  declare username: string

  @column({ serializeAs: null })
  declare accessToken: string

  @column({ serializeAs: null })
  declare refreshToken: string | null

  @column.dateTime()
  declare expiresAt: DateTime | null

  @column()
  declare scope: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => SocialPlatform, {
    foreignKey: 'platformId',
  })
  declare platform: BelongsTo<typeof SocialPlatform>

  @hasMany(() => ScheduledPost)
  declare scheduledPosts: HasMany<typeof ScheduledPost>
}
