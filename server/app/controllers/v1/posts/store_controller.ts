import Brand from '#models/brand';
import Post from '#models/post';
import ForbiddenException from '#exceptions/forbidden_exception';
import { HttpContext } from '@adonisjs/core/http';
import { createPostValidator } from '#validators/post/create_validator';

export default class StoreController {
  async handle({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail();
    const payload = await createPostValidator.validate(request.body());

    const brand = await Brand.query()
      .where('id', payload.brandId)
      .whereHas('members', query => {
        query.where('userId', user.id);
      })
      .first();

    if (!brand) {
      throw new ForbiddenException('Brand not found');
    }

    const post = new Post();
    post.brandId = brand.id;
    post.title = payload.title;
    post.content = payload.content;
    post.state = payload.state ?? 'draft';
    post.createdBy = user.id;
    post.isAiGenerated = payload.isAiGenerated ?? false;

    await post.save();

    const formatResponse = {
      id: post.id,
      brandId: post.brandId,
      title: post.title,
      content: post.content,
      state: post.state,
      isAiGenerated: post.isAiGenerated,
      createdBy: post.createdBy,
    };

    return response.status(201).json({
      status: 'success',
      message: 'Post created successfully',
      data: formatResponse,
    });
  }
}
