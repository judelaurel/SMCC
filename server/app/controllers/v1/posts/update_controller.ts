import NotFoundException from '#exceptions/not_found_exception';
import Post from '#models/post';
import BrandMember from '#models/brand_member';
import CacheService from '#services/cache_service';
import { updatePostValidator } from '#validators/post/update_validator';
import { HttpContext } from '@adonisjs/core/http';
import ScheduledPost from '#models/scheduled_post';

export default class UpdateController {
  async handle({ auth, params, request, response }: HttpContext) {
    const user = auth.getUserOrFail();

    const payload = await updatePostValidator.validate(request.body());

    const post = await Post.query()
      .where('id', params.id)
      .where(query => {
        query
          .where('createdBy', user.id)
          .orWhereExists(
            BrandMember.query()
              .select('id')
              .whereColumn('brand_members.brand_id', 'posts.brand_id')
              .where('user_id', user.id)
              .where('role', 'owner'),
          );
      })
      .first();

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    post.title = payload.title ?? post.title;
    post.content = payload.content ?? post.content;
    post.isAiGenerated = payload.isAiGenerated ?? post.isAiGenerated;
    post.state = payload.state ?? post.state;

    await post.save();

    if (post.state === 'scheduled') {
      const schedulePosts = await ScheduledPost.query()
        .where('postId', post.id)
        .where('publishStatus', 'pending')
        .first();

      if (schedulePosts) {
        schedulePosts.title = post.title;
        await schedulePosts.save();
      }
    }

    await CacheService.invalidate(
      `cache:posts:b:${post.brandId}:*`,
      `cache:schedules:b:${post.brandId}`,
    );

    return response.ok({
      status: 'success',
      message: 'Post updated successfully',
      data: post,
    });
  }
}
