import Brand from '#models/brand';
import { HttpContext } from '@adonisjs/core/http';

export default class IndexController {
  async handle({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail();

    const brands = await Brand.baseQuery()
      .whereHas('members', query => {
        query.where('userId', user.id);
      })
      // Preload only the current user's membership so the frontend knows their role
      .preload('members', q => q.where('userId', user.id))
      .orderBy('createdAt', 'desc');

    return response.status(200).json({
      status: 'success',
      message: 'Brands retrieved successfully',
      data: brands,
    });
  }
}
