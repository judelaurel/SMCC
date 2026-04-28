import BrandMember from '#models/brand_member';
import ForbiddenException from '#exceptions/forbidden_exception';
import { updateBrandMemberValidator } from '#validators/brand/brand_member_validator';
import { HttpContext } from '@adonisjs/core/http';

export default class UpdateController {
  async handle({ auth, params, request, response }: HttpContext) {
    const currentUser = auth.getUserOrFail();
    const brandId = params.brandId;
    const memberId = params.memberId;

    // Verify the requesting user is an owner or admin
    const currentMembership = await BrandMember.query()
      .where('brandId', brandId)
      .where('userId', currentUser.id)
      .first();

    if (!currentMembership || currentMembership.role === 'member') {
      throw new ForbiddenException('Only owners and admins can update members');
    }

    const targetMember = await BrandMember.query()
      .where('id', memberId)
      .where('brandId', brandId)
      .firstOrFail();

    // Cannot modify owner role
    if (targetMember.role === 'owner') {
      throw new ForbiddenException("Cannot modify the owner's role");
    }

    // Cannot change own role
    if (targetMember.userId === currentUser.id) {
      throw new ForbiddenException('Cannot change your own role');
    }

    const payload = await request.validateUsing(updateBrandMemberValidator);

    // Admins can only set 'member' role
    if (currentMembership.role === 'admin' && payload.role !== 'member') {
      throw new ForbiddenException('Admins can only assign the member role');
    }

    targetMember.role = payload.role;
    await targetMember.save();
    await targetMember.load('user');

    return response.status(200).json({
      status: 'success',
      message: 'Member role updated successfully',
      data: targetMember,
    });
  }
}
