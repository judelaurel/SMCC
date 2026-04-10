import vine from '@vinejs/vine'

const postStatus = vine.enum(['draft', 'scheduled', 'published'] as const)

export const updatePostValidator = vine.create({
  title: vine.string().trim().minLength(1).maxLength(255).optional(),
  content: vine.string().trim().minLength(1).optional(),
  status: postStatus.optional(),
  platformId: vine.number().positive().optional(),
  scheduledAt: vine.date().optional(),
})