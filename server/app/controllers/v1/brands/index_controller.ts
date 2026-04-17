import Brand from '#models/brand';
import { HttpContext } from '@adonisjs/core/http';

export default class IndexController {
  async handle({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail();

    const brands = await Brand.baseQuery()
      .whereHas('members', query => {
        query.where('id', user.id);
      })
      .orderBy('createdAt', 'desc');

    return response.status(200).json({
      status: 'success',
      message: 'Brands retrieved successfully',
      data: brands,
    });
  }
}
