import SocialAccount from '#models/social_account'
import { HttpContext } from '@adonisjs/core/http'

export default class IndexController {
  async handle({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    const accounts = await SocialAccount.query()
      .where('userId', user.id)
      .preload('platform')
      .orderBy('createdAt', 'desc')

    return response.status(200).json({
      status: 'success',
      message: 'Social accounts retrieved successfully',
      data: accounts,
    })
  }
}
