import BrandMember from '#models/brand_member';
import { HttpContext } from '@adonisjs/core/http';

export default class IndexController {
  async handle({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail();
    const brandId = params.brandId;

    // Verify the requesting user is a member of the brand
    const membership = await BrandMember.query()
      .where('brandId', brandId)
      .where('userId', user.id)
      .first();

    if (!membership) {
      return response.status(403).json({
        status: 'error',
        message: 'You are not a member of this brand',
      });
    }

    const members = await BrandMember.query()
      .where('brandId', brandId)
      .preload('user')
      .orderBy('createdAt', 'asc');

    return response.status(200).json({
      status: 'success',
      message: 'Brand members retrieved successfully',
      data: {
        members,
        currentUserRole: membership.role,
      },
    });
  }
}
