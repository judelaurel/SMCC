import vine from '@vinejs/vine'

export const createSocialAccountValidator = vine.create({
  platformId: vine.number().positive(),
  providerUserId: vine.string().trim(),
  username: vine.string().trim(),
  accessToken: vine.string().trim(),
  refreshToken: vine.string().trim().optional(),
  expiresAt: vine.string().trim().optional(),
  scope: vine.string().trim().optional(),
})
