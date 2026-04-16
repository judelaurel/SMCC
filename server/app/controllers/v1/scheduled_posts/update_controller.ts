import ScheduledPost from '#models/scheduled_post'
import { updateScheduledPostValidator } from '#validators/scheduled_post/create_update_validator'
import { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

export default class UpdateController {
  async handle({ auth, params, request, response }: HttpContext) {
    const user = auth.getUserOrFail()

    const post = await ScheduledPost.query()
      .where('id', params.id)
      .whereHas('socialAccount', (q) => q.where('userId', user.id))
      .firstOrFail()

    const payload = await updateScheduledPostValidator.validate(request.body())

    await post
      .merge({
        ...(payload.title !== undefined && { title: payload.title }),
        ...(payload.content !== undefined && { content: payload.content }),
        ...(payload.subreddit !== undefined && { subreddit: payload.subreddit }),
        ...(payload.postType !== undefined && { postType: payload.postType }),
        ...(payload.scheduledAt !== undefined && {
          scheduledAt: DateTime.fromISO(payload.scheduledAt),
        }),
        ...(payload.status !== undefined && { status: payload.status }),
      })
      .save()

    return response.status(200).json({
      status: 'success',
      message: 'Scheduled post updated successfully',
      data: post,
    })
  }
}
