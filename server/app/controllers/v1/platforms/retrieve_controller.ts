import SocialPlatform from '#models/social_platform'
import { HttpContext } from '@adonisjs/core/http'

export default class RetrieveController {
  async handle({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    if(!user)
      return response.status(401).json({
        status: 'error',
        message: 'Unauthorized',
      })

    const platforms = await SocialPlatform.query()
      .orderBy('platform', 'asc')

    return response.status(200).json({
      status: 'success',
      message: 'Platforms retrieved successfully',
      data: platforms,
    })
  }
}
