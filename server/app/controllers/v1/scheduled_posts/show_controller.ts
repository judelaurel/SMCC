import ScheduledPost from '#models/scheduled_post'
import { HttpContext } from '@adonisjs/core/http'

export default class ShowController {
  async handle({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()

    const post = await ScheduledPost.query()
      .where('id', params.id)
      .whereHas('socialAccount', (q) => q.where('userId', user.id))
      .preload('socialAccount', (q) => q.preload('platform'))
      .firstOrFail()

    return response.status(200).json({
      status: 'success',
      message: 'Scheduled post retrieved successfully',
      data: post,
    })
  }
}
