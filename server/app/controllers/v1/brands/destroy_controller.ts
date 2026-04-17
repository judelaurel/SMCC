import Brand from '#models/brand';
import { HttpContext } from '@adonisjs/core/http';

export default class DestroyController {
  async handle({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail();

    const brand = await Brand.query()
      .where('id', params.id)
      .where('userId', user.id)
      .firstOrFail();

    await brand.delete();

    return response.status(200).json({
      status: 'success',
      message: 'Brand deleted successfully',
      data: null,
    });
  }
}
