import vine from '@vinejs/vine'

export const createScheduledPostValidator = vine.create({
  socialAccountId: vine.number().positive(),
  postId: vine.number().positive().optional(),
  // title: vine.string().trim().minLength(1).maxLength(300),
  // content: vine.string().trim().optional(),
  subreddit: vine.string().trim().minLength(1).maxLength(100).optional(),
  postType: vine.enum(['text', 'link', 'image'] as const).optional(),
  scheduledAt: vine.string().trim().optional(),
})

export const updateScheduledPostValidator = vine.create({
  title: vine.string().trim().minLength(1).maxLength(300).optional(),
  content: vine.string().trim().optional(),
  subreddit: vine.string().trim().minLength(1).maxLength(100).optional(),
  postType: vine.enum(['text', 'link', 'image'] as const).optional(),
  scheduledAt: vine.string().trim().optional(),
  status: vine.enum(['pending', 'processing', 'posted', 'failed'] as const).optional(),
})
