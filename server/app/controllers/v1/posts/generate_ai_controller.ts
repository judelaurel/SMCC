import Brand from '#models/brand';
import { anthropicService } from '#services/ai/anthropic_service';
import { generateAiPostValidator } from '#validators/ai_post';
import { HttpContext } from '@adonisjs/core/http';

export default class GenerateAiController {
  async handle({ auth, request, response }: HttpContext) {
    auth.getUserOrFail();

    const payload = await request.validateUsing(generateAiPostValidator);

    let brandName: string | undefined;
    let brandDescription: string | undefined;

    if (payload.brandId) {
      const brand = await Brand.find(payload.brandId);
      if (brand) {
        brandName = brand.name;
        brandDescription = brand.description ?? undefined;
      }
    }

    let variations;
    try {
      variations = await anthropicService.generatePostVariations({
        topic: payload.topic,
        platform: payload.platform,
        toneOfVoice: payload.toneOfVoice,
        keywords: payload.keywords,
        brandName,
        brandDescription,
      });
    } catch (err: any) {
      return response.status(502).json({
        status: 'error',
        message: err?.message ?? 'AI generation failed',
        data: null,
      });
    }

    return response.status(200).json({
      status: 'success',
      message: 'Variations generated',
      data: { variations },
    });
  }
}
