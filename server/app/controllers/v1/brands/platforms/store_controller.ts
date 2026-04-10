import Brand from '#models/brand'
import SocialPlatform from '#models/social_platform'
import { createPlatformValidator } from '#validators/platform/create_validator'
import { HttpContext } from '@adonisjs/core/http'

export default class StoreController {
  async handle({ auth, params, request, response }: HttpContext) {
    const user = auth.getUserOrFail()

    const brand = await Brand.query()
      .where('id', params.brandId)
      .where('userId', user.id)
      .firstOrFail()

    const payload = await createPlatformValidator.validate(request.body())

    const existing = await SocialPlatform.query()
      .where('brandId', brand.id)
      .where('platform', payload.platform)
      .first()

    if (existing) {
      return response.status(200).json({
        status: 'success',
        message: 'Platform already connected to this brand',
        data: { platform: existing },
      })
    }

    const platform = await SocialPlatform.create({
      brandId: brand.id,
      platform: payload.platform,
      isActive: payload.isActive ?? true,
    })

    return response.status(201).json({
      status: 'success',
      message: 'Platform added successfully',
      data: { platform },
    })
  }
}
