import SocialPlatform from '#models/social_platform';
import { HttpContext } from '@adonisjs/core/http';

export default class SocialPlatformsIndexController {
  async handle({ response }: HttpContext) {
    const platforms = await SocialPlatform.query().orderBy('platform', 'asc');

    return response.status(200).json({
      status: 'success',
      message: 'Social platforms retrieved successfully',
      data: platforms,
    });
  }
}
