import vine from '@vinejs/vine'

const postStatus = vine.enum(['draft', 'scheduled', 'published'] as const)

export const createPostValidator = vine.create({
  brandId: vine.number().positive(),
  platformId: vine.number().positive(),
  title: vine.string().trim().minLength(1).maxLength(255),
  content: vine.string().trim().minLength(1),
  status: postStatus.optional(),
  isAiGenerated: vine.boolean().optional(),
  scheduledAt: vine.date().optional(),
})