import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Post from '#models/post'

export default class ContentTag extends BaseModel {
  static table = 'content_tags'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare postId: number

  @column()
  declare tag: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @belongsTo(() => Post)
  declare post: BelongsTo<typeof Post>
}
