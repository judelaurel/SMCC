import NotFoundException from '#exceptions/not_found_exception';
import Post from '#models/post';
import { HttpContext } from '@adonisjs/core/http';

export default class ShowController {
  async handle({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail();

    const post = await Post.baseQuery()
      .where('id', params.id)
      .whereHas('brand', brandQuery => {
        brandQuery.whereHas('members', memberQuery => {
          memberQuery.where('userId', user.id);
        });
      })
      .preload('tags')
      .first();

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return response.status(200).json({
      status: 'success',
      message: 'Post retrieved successfully',
      data: post,
    });
  }
}
