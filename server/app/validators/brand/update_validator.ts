import vine from '@vinejs/vine'

const toneOfVoice = vine.enum(['professional', 'casual', 'witty', 'formal'] as const)
const colorHex = vine.string().regex(/^#[0-9A-Fa-f]{6}$/)

export const updateBrandValidator = vine.create({
  name: vine.string().trim().minLength(2).maxLength(100).optional(),
  description: vine.string().trim().maxLength(500).optional(),
  toneOfVoice: toneOfVoice.optional(),
  logoUrl: vine.string().url().optional(),
  primaryColor: colorHex.optional(),
})
