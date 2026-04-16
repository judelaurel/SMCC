import vine from '@vinejs/vine'

export const createPlatformValidator = vine.create({
  platform: vine.enum(['instagram', 'twitter', 'linkedin', 'mastodon'] as const),
  isActive: vine.boolean().optional(),
})
