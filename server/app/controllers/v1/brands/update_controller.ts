import Brand from '#models/brand'
import { updateBrandValidator } from '#validators/brand/update_validator'
import { HttpContext } from '@adonisjs/core/http'

export default class UpdateController {
  async handle({ auth, params, request, response }: HttpContext) {
    const user = auth.getUserOrFail()

    const brand = await Brand.query()
      .where('id', params.id)
      .where('userId', user.id)
      .firstOrFail()

    const payload = await updateBrandValidator.validate(request.body())
    brand.merge(payload)
    await brand.save()

    return response.status(200).json({
      status: 'success',
      message: 'Brand updated successfully',
      data: brand,
    })
  }
}
