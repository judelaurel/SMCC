import SocialAccount from '#models/social_account'
import { HttpContext } from '@adonisjs/core/http'

export default class DestroyController {
  async handle({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()

    const account = await SocialAccount.query()
      .where('id', params.id)
      .where('userId', user.id)
      .firstOrFail()

    await account.delete()

    return response.status(200).json({
      status: 'success',
      message: 'Social account unlinked successfully',
      data: null,
    })
  }
}
