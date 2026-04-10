import Post from '#models/post'
import { updatePostValidator } from '#validators/post/update_validator'
import { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

export default class UpdateController {
  async handle({ auth, params, request, response }: HttpContext) {
    const user = auth.getUserOrFail()

    const post = await Post.query()
      .where('id', params.id)
      .where('userId', user.id)
      .firstOrFail()

    const payload = await updatePostValidator.validate(request.body())

    post.merge({
      title: payload.title,
      content: payload.content,
      status: payload.status,
      platformId: payload.platformId,
      scheduledAt: payload.scheduledAt ? DateTime.fromJSDate(payload.scheduledAt) : undefined,
    })

    await post.save()

    return response.status(200).json({
      status: 'success',
      message: 'Post updated successfully',
      data: { post },
    })
  }
}
