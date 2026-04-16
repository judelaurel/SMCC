import Brand from '#models/brand'
import SocialPlatform from '#models/social_platform'
import { HttpContext } from '@adonisjs/core/http'

export default class DestroyController {
  async handle({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()

    const brand = await Brand.query()
      .where('id', params.brandId)
      .where('userId', user.id)
      .firstOrFail()

    const platform = await SocialPlatform.query()
      .where('id', params.platformId)
      .where('brandId', brand.id)
      .firstOrFail()

    await platform.delete()

    return response.status(200).json({
      status: 'success',
      message: 'Platform removed successfully',
      data: null,
    })
  }
}
