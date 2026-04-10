import Post from '#models/post'
import { HttpContext } from '@adonisjs/core/http'

export default class DestroyController {
  async handle({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()

    const post = await Post.query()
      .where('id', params.id)
      .where('userId', user.id)
      .firstOrFail()

    await post.delete()

    return response.status(200).json({
      status: 'success',
      message: 'Post deleted successfully',
      data: null,
    })
  }
}
