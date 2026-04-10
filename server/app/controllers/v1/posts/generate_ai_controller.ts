import { generateAiPostValidator } from '#validators/ai_post'
import { HttpContext } from '@adonisjs/core/http'

export default class GenerateAiController {
  async handle({ request, response }: HttpContext) {
    await generateAiPostValidator.validate(request.body())

    // TODO (Week 4): Integrate Anthropic Claude SDK
    // 1. Build a system prompt using brand.toneOfVoice + payload.platform
    // 2. Call Anthropic client.messages.create(...)
    // 3. Parse response and return 3 variations

    return response.status(501).json({
      status: 'error',
      message: 'AI generation not yet implemented — coming in Week 4',
      data: null,
    })
  }
}
