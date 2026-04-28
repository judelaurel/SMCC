import Brand from '#models/brand';
import BrandMember from '#models/brand_member';
import ForbiddenException from '#exceptions/forbidden_exception';
import { HttpContext } from '@adonisjs/core/http';

export default class DestroyController {
  async handle({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail();

    // Only the owner can delete a brand
    const membership = await BrandMember.query()
      .where('brandId', params.id)
      .where('userId', user.id)
      .first();

    if (!membership || membership.role !== 'owner') {
      throw new ForbiddenException('Only the brand owner can delete a brand');
    }

    const brand = await Brand.findOrFail(params.id);
    await brand.delete();

    return response.status(200).json({
      status: 'success',
      message: 'Brand deleted successfully',
      data: null,
    });
  }
}
