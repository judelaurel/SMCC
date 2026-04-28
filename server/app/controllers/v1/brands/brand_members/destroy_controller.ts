import BrandMember from '#models/brand_member';
import ForbiddenException from '#exceptions/forbidden_exception';
import { HttpContext } from '@adonisjs/core/http';

export default class DestroyController {
  async handle({ auth, params, response }: HttpContext) {
    const currentUser = auth.getUserOrFail();
    const brandId = params.brandId;
    const memberId = params.memberId;

    // Only owner can remove members
    const currentMembership = await BrandMember.query()
      .where('brandId', brandId)
      .where('userId', currentUser.id)
      .first();

    if (!currentMembership || currentMembership.role !== 'owner') {
      throw new ForbiddenException('Only the owner can remove members');
    }

    const targetMember = await BrandMember.query()
      .where('id', memberId)
      .where('brandId', brandId)
      .firstOrFail();

    // Cannot remove the owner (self)
    if (targetMember.role === 'owner') {
      throw new ForbiddenException('Cannot remove the brand owner');
    }

    await targetMember.delete();

    return response.status(200).json({
      status: 'success',
      message: 'Member removed successfully',
      data: null,
    });
  }
}
