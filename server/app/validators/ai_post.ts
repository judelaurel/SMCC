import vine from '@vinejs/vine'

export const generateAiPostValidator = vine.create({
  topic: vine.string().trim().minLength(3).maxLength(200),
  platform: vine.enum(['instagram', 'twitter', 'linkedin', 'mastodon'] as const),
  toneOfVoice: vine.enum(['professional', 'casual', 'witty', 'formal'] as const),
  keywords: vine.array(vine.string().trim().maxLength(50)).minLength(1).maxLength(10),
})
