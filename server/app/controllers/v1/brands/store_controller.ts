import Brand from '#models/brand';
import BrandMember from '#models/brand_member';
import { createBrandValidator } from '#validators/brand/create_validator';
import { HttpContext } from '@adonisjs/core/http';

export default class StoreController {
  async handle({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail();
    const payload = await createBrandValidator.validate(request.body());

    const brand = await Brand.create({
      name: payload.name,
      description: payload.description ?? null,
      toneOfVoice: payload.toneOfVoice,
      logoUrl: payload.logoUrl ?? null,
      primaryColor: payload.primaryColor ?? null,
    });

    // Automatically add the creator as the owner
    await BrandMember.create({
      brandId: brand.id,
      userId: user.id,
      role: 'owner',
      addedBy: user.id,
    });

    return response.status(201).json({
      status: 'success',
      message: 'Brand created successfully',
      data: brand,
    });
  }
}
