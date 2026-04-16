import Post from '#models/post'
import { updatePostValidator } from '#validators/post/update_validator'
import { HttpContext } from '@adonisjs/core/http'

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
      state: payload.state,
      // platformId: payload.platformId
    })

    await post.save()

    return response.status(200).json({
      status: 'success',
      message: 'Post updated successfully',
      data: post,
    })
  }
}
