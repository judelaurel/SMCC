import ForbiddenException from '#exceptions/forbidden_exception';
import NotFoundException from '#exceptions/not_found_exception';
import Post from '#models/post';
import BrandMember from '#models/brand_member';
import { updatePostValidator } from '#validators/post/update_validator';
import { HttpContext } from '@adonisjs/core/http';

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

    if (['completed', 'archived'].includes(post.state)) {
      throw new ForbiddenException('Cannot edit post in its current state');
    }

    post.merge(payload);
    await post.save();

    return response.ok({
      status: 'success',
      message: 'Post updated successfully',
      data: post,
    });
  }
}
