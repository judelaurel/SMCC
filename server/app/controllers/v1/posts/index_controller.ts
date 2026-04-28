import Post from '#models/post';
import BrandMember from '#models/brand_member';
import { retrievePostValidator } from '#validators/post/retrieve_validator';
import { HttpContext } from '@adonisjs/core/http';

export default class IndexController {
  async handle({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail();
    const { brandId, state } = await request.validateUsing(
      retrievePostValidator,
    );

    // Resolve the user's role in this brand
    const membership = await BrandMember.query()
      .where('brandId', brandId)
      .where('userId', user.id)
      .first();

    const postsQuery = Post.baseQuery()
      .where('brand_id', brandId)
      .whereHas('brand', brandQuery => {
        brandQuery.whereHas('members', memberQuery => {
          memberQuery.where('userId', user.id);
        });
      })
      .if(state, query => {
        query.where('state', state || 'draft');
      })
      .preload('tags')
      .orderBy('createdAt', 'desc');

    // Members only see posts they created
    if (membership?.role === 'member') {
      postsQuery.where('created_by', user.id);
    }

    const posts = await postsQuery;

    return response.status(200).json({
      status: 'success',
      message: 'Posts retrieved successfully',
      data: posts,
    });
  }
}
