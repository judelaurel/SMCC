import ScheduledPost from '#models/scheduled_post';
import BrandMember from '#models/brand_member';
import ForbiddenException from '#exceptions/forbidden_exception';
import { HttpContext } from '@adonisjs/core/http';

export default class IndexController {
  async handle({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail();
    const brandId = request.input('brandId');

    let postsQuery = ScheduledPost.query()
      .preload('socialAccount', q => q.preload('platform'))
      .preload('post')
      .orderBy('scheduledAt', 'asc');

    if (brandId) {
      // Verify user is a member of this brand
      const membership = await BrandMember.query()
        .where('brandId', brandId)
        .where('userId', user.id)
        .first();

      if (!membership) {
        throw new ForbiddenException('You are not a member of this brand');
      }

      // Return all scheduled posts for posts belonging to this brand
      postsQuery = postsQuery.whereHas('post', q =>
        q.where('brandId', brandId),
      );
    } else {
      // Fallback: only return scheduled posts from the user's own social accounts
      postsQuery = postsQuery.whereHas('socialAccount', q =>
        q.where('userId', user.id),
      );
    }

    const posts = await postsQuery;

    return response.status(200).json({
      status: 'success',
      message: 'Scheduled posts retrieved successfully',
      data: posts,
    });
  }
}
