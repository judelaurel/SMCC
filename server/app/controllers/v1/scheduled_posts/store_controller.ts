import Post from '#models/post';
import BrandMember from '#models/brand_member';
import ScheduledPost from '#models/scheduled_post';
import SocialAccount from '#models/social_account';
import { createScheduledPostValidator } from '#validators/scheduled_post/create_update_validator';
import ForbiddenException from '#exceptions/forbidden_exception';
import { HttpContext } from '@adonisjs/core/http';
import PublishPost from '../../../jobs/publish_post.ts';
import logger from '@adonisjs/core/services/logger';

export default class StoreController {
  async handle({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail();
    const payload = await request.validateUsing(createScheduledPostValidator);

    // Verify the post exists and belongs to a brand the user is a member of
    const post = await Post.findOrFail(payload.postId);

    const membership = await BrandMember.query()
      .where('brandId', post.brandId)
      .where('userId', user.id)
      .first();

    if (!membership) {
      throw new ForbiddenException(
        'You do not have permission to schedule posts for this brand',
      );
    }

    // Verify all requested social accounts belong to the authenticated user and are active
    const socialAccounts = await SocialAccount.query()
      .whereIn('id', payload.socialAccountIds)
      .where('userId', user.id)
      .where('isActive', true);

    if (socialAccounts.length !== payload.socialAccountIds.length) {
      throw new ForbiddenException(
        'One or more social accounts do not belong to you',
      );
    }

    const diffMs = payload.scheduledAt.diffNow().as('milliseconds');
    const totalMinutes = Math.max(0, Math.ceil(diffMs / 60000));

    const scheduledPosts = await Promise.all(
      socialAccounts.map(async account => {
        const scheduled = await ScheduledPost.create({
          socialAccountId: account.id,
          postId: post.id,
          postType: payload.postType ?? 'text',
          scheduledAt: payload.scheduledAt,
          publishStatus: 'pending',
        });

        await PublishPost.dispatch({
          postId: post.id,
          scheduledPostId: scheduled.id,
        }).in(`${totalMinutes}m`);

        logger.info(
          `Scheduled PublishPost job for post ${post.id} on account ${account.id} (scheduledPostId ${scheduled.id}) in ${totalMinutes} minutes`,
        );

        return scheduled;
      }),
    );

    // Update the post state to 'scheduled'
    post.state = 'scheduled';
    await post.save();

    return response.status(201).json({
      status: 'success',
      message: 'Post scheduled successfully',
      data: scheduledPosts,
    });
  }
}
