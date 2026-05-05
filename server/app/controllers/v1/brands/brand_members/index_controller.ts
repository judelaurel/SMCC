import BrandMember from '#models/brand_member';
import CacheService, { CacheKey, CacheTTL } from '#services/cache_service';
import { HttpContext } from '@adonisjs/core/http';

export default class IndexController {
  async handle({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail();
    const brandId = params.brandId;

    const membership = await BrandMember.query()
      .where('brandId', brandId)
      .where('userId', user.id)
      .first();

    if (!membership) {
      return response.status(403).json({
        status: 'error',
        message: 'You are not a member of this brand',
      });
    }

    const cacheKey = CacheKey.members(Number(brandId), user.id);
    const cached = await CacheService.get(cacheKey);
    if (cached) return response.status(200).json(cached);

    const members = await BrandMember.query()
      .where('brandId', brandId)
      .preload('user')
      .orderBy('createdAt', 'asc');

    const result = {
      status: 'success',
      message: 'Brand members retrieved successfully',
      data: {
        members,
        currentUserRole: membership.role,
      },
    };

    await CacheService.set(cacheKey, result, CacheTTL.members);
    return response.status(200).json(result);
  }
}
