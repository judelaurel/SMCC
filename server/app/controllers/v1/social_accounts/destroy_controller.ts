import SocialAccount from '#models/social_account';
import CacheService, { CacheKey } from '#services/cache_service';
import { HttpContext } from '@adonisjs/core/http';

export default class DestroyController {
  async handle({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail();

    const account = await SocialAccount.query()
      .where('id', params.id)
      .where('userId', user.id)
      .firstOrFail();

    account.isActive = false;
    await account.save();

    await CacheService.invalidate(
      CacheKey.socialAccounts(user.id),
      `cache:schedules:u:${user.id}`,
    );

    return response.status(200).json({
      status: 'success',
      message: 'Social account disconnected successfully',
      data: null,
    });
  }
}
