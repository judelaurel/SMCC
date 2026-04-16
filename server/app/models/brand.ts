import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { randomUUID } from 'node:crypto'
import User from '#models/user'
import SocialPlatform from '#models/social_platform'
import BrandMember from './brand_member.ts'

export default class Brand extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare uuid: string

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column()
  declare toneOfVoice: 'professional' | 'casual' | 'witty' | 'formal'

  @column()
  declare logoUrl: string | null

  @column()
  declare primaryColor: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @beforeCreate()
  static assignUuid(brand: Brand) {
    brand.uuid = randomUUID()
  }

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => SocialPlatform)
  declare platforms: HasMany<typeof SocialPlatform>

  @hasMany(() => BrandMember)
  declare members: HasMany<typeof BrandMember>
}
