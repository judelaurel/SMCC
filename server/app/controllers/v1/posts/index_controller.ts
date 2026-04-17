import Post from '#models/post';
import { retrievePostValidator } from '#validators/post/retrieve_validator';
import { HttpContext } from '@adonisjs/core/http';

export default class IndexController {
  async handle({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail();
    const { brandId, state } = await request.validateUsing(
      retrievePostValidator,
    );

    const posts = await Post.baseQuery()
      .where('brand_id', brandId)
      .whereHas('brand', brandQuery => {
        brandQuery.whereHas('members', memberQuery => {
          memberQuery.where('userId', user.id);
        });
      })
      .if(state, query => {
        query.where('state', !state);
      })
      .preload('tags')
      .orderBy('createdAt', 'desc');

    return response.status(200).json({
      status: 'success',
      message: 'Posts retrieved successfully',
      data: posts,
    });
  }
}
