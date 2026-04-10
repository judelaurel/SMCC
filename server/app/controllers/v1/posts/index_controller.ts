import Post from '#models/post'
import { HttpContext } from '@adonisjs/core/http'

export default class IndexController {
  async handle({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const { status, brand_id: brandId, from, to } = request.qs()

    const query = Post.query()
      .where('userId', user.id)
      .preload('brand')
      .preload('platform')
      .preload('tags')
      .orderBy('createdAt', 'desc')

    if (status) query.where('status', status)
    if (brandId) query.where('brandId', brandId)
    if (from) query.where('scheduledAt', '>=', from)
    if (to) query.where('scheduledAt', '<=', to)

    const posts = await query

    return response.status(200).json({
      status: 'success',
      message: 'Posts retrieved successfully',
      data: { posts },
    })
  }
}
