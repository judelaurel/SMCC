import Brand from '#models/brand';
import { HttpContext } from '@adonisjs/core/http';

export default class IndexController {
  async handle({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail();

    const page = Math.max(1, Number(request.input('page', 1)));
    const limit = Math.min(50, Math.max(1, Number(request.input('limit', 5))));

    const paginator = await Brand.baseQuery()
      .whereHas('members', query => {
        query.where('userId', user.id);
      })
      .preload('members', q => q.where('userId', user.id))
      .orderBy('name', 'asc')
      .paginate(page, limit);

    return response.status(200).json({
      status: 'success',
      message: 'Brands retrieved successfully',
      data: paginator.all(),
      meta: {
        total: paginator.total,
        page: paginator.currentPage,
        lastPage: paginator.lastPage,
        perPage: paginator.perPage,
        hasMore: paginator.hasMorePages,
      },
    });
  }
}
