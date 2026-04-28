import ScheduledPost from '#models/scheduled_post';
import Post from '#models/post';
import BrandMember from '#models/brand_member';
import ForbiddenException from '#exceptions/forbidden_exception';
import { HttpContext } from '@adonisjs/core/http';

export default class DestroyController {
  async handle({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail();

    // Load the scheduled post (without userId restriction — role check is below)
    const scheduledPost = await ScheduledPost.query()
      .where('id', params.id)
      .preload('socialAccount')
      .firstOrFail();

    // Load the parent post to determine the brand
    const post = await Post.findOrFail(scheduledPost.postId);

    // Verify the user belongs to the brand
    const membership = await BrandMember.query()
      .where('brandId', post.brandId)
      .where('userId', user.id)
      .first();

    if (!membership) {
      throw new ForbiddenException('You do not have access to this brand');
    }

    // Members can only cancel scheduled posts created via their own social accounts
    if (
      membership.role === 'member' &&
      scheduledPost.socialAccount?.userId !== user.id
    ) {
      throw new ForbiddenException(
        'Members can only cancel their own scheduled posts',
      );
    }

    // Soft-cancel instead of hard delete to preserve history
    scheduledPost.publishStatus = 'cancelled';
    await scheduledPost.save();

    // If no remaining active scheduled posts for this post, revert to draft
    const activeSchedules = await ScheduledPost.query()
      .where('postId', scheduledPost.postId)
      .whereNotIn('publishStatus', ['cancelled', 'failed'])
      .first();

    if (!activeSchedules) {
      if (post.state === 'scheduled') {
        post.state = 'draft';
        await post.save();
      }
    }

    return response.status(200).json({
      status: 'success',
      message: 'Scheduled post cancelled successfully',
      data: null,
    });
  }
}
