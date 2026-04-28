import BrandMember from '#models/brand_member';
import User from '#models/user';
import ForbiddenException from '#exceptions/forbidden_exception';
import { HttpContext } from '@adonisjs/core/http';

export default class AvailableUsersController {
  async handle({ auth, params, response }: HttpContext) {
    const currentUser = auth.getUserOrFail();
    const brandId = params.brandId;

    // Verify the requesting user is an owner or admin
    const currentMembership = await BrandMember.query()
      .where('brandId', brandId)
      .where('userId', currentUser.id)
      .first();

    if (!currentMembership || currentMembership.role === 'member') {
      throw new ForbiddenException('Only owners and admins can invite members');
    }

    // Get user IDs already in the brand
    const existingMemberIds = await BrandMember.query()
      .where('brandId', brandId)
      .select('userId');

    const excludeIds = existingMemberIds.map(m => m.userId);

    // Find users not already in the brand
    const users = await User.query()
      .whereNotIn('id', excludeIds)
      .where('isDeleted', false)
      .select('id', 'username', 'email', 'firstName', 'lastName')
      .orderBy('username', 'asc');

    return response.status(200).json({
      status: 'success',
      message: 'Available users retrieved successfully',
      data: users,
    });
  }
}
