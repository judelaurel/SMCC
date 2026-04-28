import BrandMember from '#models/brand_member';
import User from '#models/user';
import ForbiddenException from '#exceptions/forbidden_exception';
import { createBrandMemberValidator } from '#validators/brand/brand_member_validator';
import { HttpContext } from '@adonisjs/core/http';

export default class StoreController {
  async handle({ auth, params, request, response }: HttpContext) {
    const currentUser = auth.getUserOrFail();
    const brandId = params.brandId;

    // Verify the requesting user is an owner or admin
    const currentMembership = await BrandMember.query()
      .where('brandId', brandId)
      .where('userId', currentUser.id)
      .first();

    if (!currentMembership || currentMembership.role === 'member') {
      throw new ForbiddenException('Only owners and admins can add members');
    }

    const payload = await request.validateUsing(createBrandMemberValidator);

    // Admins can only assign 'member' role
    if (currentMembership.role === 'admin' && payload.role !== 'member') {
      throw new ForbiddenException(
        'Admins can only add members with the member role',
      );
    }

    // Verify the target user exists
    const targetUser = await User.find(payload.userId);
    if (!targetUser) {
      return response.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    // Verify the target user is not already a member
    const existing = await BrandMember.query()
      .where('brandId', brandId)
      .where('userId', payload.userId)
      .first();

    if (existing) {
      return response.status(409).json({
        status: 'error',
        message: 'User is already a member of this brand',
      });
    }

    const member = await BrandMember.create({
      brandId,
      userId: payload.userId,
      role: payload.role,
      addedBy: currentUser.id,
    });

    await member.load('user');

    return response.status(201).json({
      status: 'success',
      message: 'Member added successfully',
      data: member,
    });
  }
}
