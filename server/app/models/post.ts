import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { randomUUID } from 'node:crypto'
import Brand from '#models/brand'
import SocialPlatform from '#models/social_platform'
import User from '#models/user'
import ContentTag from '#models/content_tag'

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare uuid: string

  @column()
  declare brandId: number

  @column()
  declare platformId: number

  @column()
  declare userId: number

  @column()
  declare title: string

  @column()
  declare content: string

  @column()
  declare status: 'draft' | 'scheduled' | 'published'

  @column()
  declare isAiGenerated: boolean

  @column.dateTime()
  declare scheduledAt: DateTime | null

  @column.dateTime()
  declare publishedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @beforeCreate()
  static assignUuid(post: Post) {
    post.uuid = randomUUID()
  }

  @belongsTo(() => Brand)
  declare brand: BelongsTo<typeof Brand>

  @belongsTo(() => SocialPlatform)
  declare platform: BelongsTo<typeof SocialPlatform>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => ContentTag)
  declare tags: HasMany<typeof ContentTag>
}
