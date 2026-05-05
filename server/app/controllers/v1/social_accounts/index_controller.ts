import SocialAccount from '#models/social_account';
import CacheService, { CacheKey, CacheTTL } from '#services/cache_service';
import { HttpContext } from '@adonisjs/core/http';

export default class IndexController {
  async handle({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail();

    const cacheKey = CacheKey.socialAccounts(user.id);
    const cached = await CacheService.get(cacheKey);
    if (cached) return response.status(200).json(cached);

    const accounts = await SocialAccount.query()
      .where('userId', user.id)
      .preload('platform')
      .orderBy('createdAt', 'desc');

    const result = {
      status: 'success',
      message: 'Social accounts retrieved successfully',
      data: accounts,
    };

    await CacheService.set(cacheKey, result, CacheTTL.socialAccounts);
    return response.status(200).json(result);
  }
}
