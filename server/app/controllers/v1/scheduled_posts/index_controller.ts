import ScheduledPost from '#models/scheduled_post';
import BrandMember from '#models/brand_member';
import CacheService, { CacheKey, CacheTTL } from '#services/cache_service';
import ForbiddenException from '#exceptions/forbidden_exception';
import { HttpContext } from '@adonisjs/core/http';

export default class IndexController {
  async handle({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail();
    const brandId = request.input('brandId');

    const cacheKey = brandId
      ? CacheKey.schedules(Number(brandId))
      : CacheKey.schedulesUser(user.id);

    const cached = await CacheService.get(cacheKey);
    if (cached) return response.status(200).json(cached);

    let postsQuery = ScheduledPost.query()
      .preload('socialAccount', q => q.preload('platform'))
      .preload('post')
      .orderBy('scheduledAt', 'asc');

    if (brandId) {
      const membership = await BrandMember.query()
        .where('brandId', brandId)
        .where('userId', user.id)
        .first();

      if (!membership) {
        throw new ForbiddenException('You are not a member of this brand');
      }

      postsQuery = postsQuery.whereHas('post', q =>
        q.where('brandId', brandId),
      );
    } else {
      postsQuery = postsQuery.whereHas('socialAccount', q =>
        q.where('userId', user.id),
      );
    }

    const posts = await postsQuery;

    const result = {
      status: 'success',
      message: 'Scheduled posts retrieved successfully',
      data: posts,
    };

    await CacheService.set(cacheKey, result, CacheTTL.schedules);
    return response.status(200).json(result);
  }
}
