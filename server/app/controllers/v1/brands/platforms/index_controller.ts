import Brand from '#models/brand'
import SocialPlatform from '#models/social_platform'
import { HttpContext } from '@adonisjs/core/http'

export default class IndexController {
  async handle({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()

    const brand = await Brand.query()
      .where('id', params.brandId)
      .where('userId', user.id)
      .firstOrFail()

    const platforms = await SocialPlatform.query()
      .where('brandId', brand.id)
      .orderBy('platform', 'asc')

    return response.status(200).json({
      status: 'success',
      message: 'Platforms retrieved successfully',
      data: { platforms },
    })
  }
}
