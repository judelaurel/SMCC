import Brand from '#models/brand'
import { createBrandValidator } from '#validators/brand/create_validator'
import { HttpContext } from '@adonisjs/core/http'

export default class StoreController {
  async handle({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const payload = await createBrandValidator.validate(request.body())

    const brand = await Brand.create({
      userId: user.id,
      name: payload.name,
      description: payload.description ?? null,
      toneOfVoice: payload.toneOfVoice,
      logoUrl: payload.logoUrl ?? null,
      primaryColor: payload.primaryColor ?? null,
    })

    return response.status(201).json({
      status: 'success',
      message: 'Brand created successfully',
      data: { brand },
    })
  }
}
