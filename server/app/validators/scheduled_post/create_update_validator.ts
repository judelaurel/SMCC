import vine from '@vinejs/vine';
import { DateTime } from 'luxon';

export const createScheduledPostValidator = vine.create({
  socialAccountIds: vine.array(vine.number().positive()).minLength(1),
  postId: vine.number().positive(),
  postType: vine.enum(['text', 'link', 'image'] as const).optional(),
  scheduledAt: vine.string().transform(value => {
    return DateTime.fromISO(value);
  }),
});

export const updateScheduledPostValidator = vine.create({
  title: vine.string().trim().minLength(1).maxLength(300).optional(),
  content: vine.string().trim().optional(),
  subreddit: vine.string().trim().minLength(1).maxLength(100).optional(),
  postType: vine.enum(['text', 'link', 'image'] as const).optional(),
  scheduledAt: vine.string().trim().optional(),
  status: vine
    .enum(['pending', 'processing', 'posted', 'failed'] as const)
    .optional(),
});
