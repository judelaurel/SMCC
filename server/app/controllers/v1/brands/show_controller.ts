import NotFoundException from '#exceptions/not_found_exception';
import Brand from '#models/brand';
import { HttpContext } from '@adonisjs/core/http';

export default class ShowController {
  async handle({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail();

    const brand = await Brand.baseQuery()
      .where('id', params.id)
      .whereHas('members', q => q.where('userId', user.id))
      .first();

    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    return response.status(200).json({
      status: 'success',
      message: 'Brand retrieved successfully',
      data: brand,
    });
  }
}
