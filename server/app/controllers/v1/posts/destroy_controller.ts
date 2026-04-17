import ForbiddenException from '#exceptions/forbidden_exception';
import NotFoundException from '#exceptions/not_found_exception';
import BrandMember from '#models/brand_member';
import Post from '#models/post';
import { HttpContext } from '@adonisjs/core/http';

export default class DestroyController {
  async handle({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail();

    const post = await Post.find(params.id);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const brandRole = await BrandMember.query()
      .where('brandId', post?.brandId)
      .where('userId', user.id)
      .first();

    if (brandRole?.role !== 'owner' && post.createdBy !== user.id) {
      throw new ForbiddenException(
        'You are not allowed to perform this action',
      );
    }
    post.state = 'archived';

    await post.save();

    return response.status(200).json({
      status: 'success',
      message: 'Post deleted successfully',
      data: null,
    });
  }
}
