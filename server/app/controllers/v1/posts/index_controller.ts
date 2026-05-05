import Post from '#models/post';
import BrandMember from '#models/brand_member';
import CacheService, { CacheKey, CacheTTL } from '#services/cache_service';
import { retrievePostValidator } from '#validators/post/retrieve_validator';
import { HttpContext } from '@adonisjs/core/http';

export default class IndexController {
  async handle({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail();
    const { brandId, state } = await request.validateUsing(
      retrievePostValidator,
    );

    // Include state in cache key only when a filter is explicitly requested
    const cacheKey = state
      ? `${CacheKey.posts(brandId, user.id)}:s:${state}`
      : CacheKey.posts(brandId, user.id);

    const cached = await CacheService.get(cacheKey);
    if (cached) return response.status(200).json(cached);

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

    if (membership?.role === 'member') {
      postsQuery.where('created_by', user.id);
    }

    const posts = await postsQuery;

    const result = {
      status: 'success',
      message: 'Posts retrieved successfully',
      data: posts,
    };

    await CacheService.set(cacheKey, result, CacheTTL.posts);
    return response.status(200).json(result);
  }
}
