import Brand from '#models/brand';
import BrandMember from '#models/brand_member';
import ForbiddenException from '#exceptions/forbidden_exception';
import { updateBrandValidator } from '#validators/brand/update_validator';
import { HttpContext } from '@adonisjs/core/http';

export default class UpdateController {
  async handle({ auth, params, request, response }: HttpContext) {
    const user = auth.getUserOrFail();

    // Only owner or admin can edit a brand
    const membership = await BrandMember.query()
      .where('brandId', params.id)
      .where('userId', user.id)
      .first();

    if (!membership || membership.role === 'member') {
      throw new ForbiddenException('Only owners and admins can edit brands');
    }

    const brand = await Brand.findOrFail(params.id);
    const payload = await request.validateUsing(updateBrandValidator);
    brand.merge(payload);
    await brand.save();

    return response.status(200).json({
      status: 'success',
      message: 'Brand updated successfully',
      data: brand,
    });
  }
}
