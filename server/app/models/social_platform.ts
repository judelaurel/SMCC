import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Brand from '#models/brand'

export default class SocialPlatform extends BaseModel {

  @column({ isPrimary: true })
  declare id: number

  // @column()
  // declare brandId: number

  @column()
  declare platform: 'instagram' | 'twitter' | 'linkedin' | 'mastodon'

  @column()
  declare isActive: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Brand)
  declare brand: BelongsTo<typeof Brand>
}
