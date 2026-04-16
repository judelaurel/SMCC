import ScheduledPost from '#models/scheduled_post'
import { HttpContext } from '@adonisjs/core/http'

export default class IndexController {
  async handle({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    const posts = await ScheduledPost.query()
      .whereHas('socialAccount', (q) => q.where('userId', user.id))
      .preload('socialAccount', (q) => q.preload('platform'))
      .orderBy('scheduledAt', 'asc')

    return response.status(200).json({
      status: 'success',
      message: 'Scheduled posts retrieved successfully',
      data: posts,
    })
  }
}
