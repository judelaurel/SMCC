import type { HttpContext } from '@adonisjs/core/http'

export default class LogoutController {
  /**
   * @handle
   */
  async handle({ auth, response }: HttpContext): Promise<void> {
    // Get the authenticated user from the auth object.
    if (auth.user) {
      // Revoke the current access token to log the user out.
      await auth.use('api').invalidateToken()

      // Return a success response indicating the user has been logged out.
      response.status(200).json({
        status: 'success',
        message: 'User logged out successfully',
      })
    } else {
      // If there is no authenticated user, return an error response.
      response.status(401).json({
        status: 'error',
        message: 'No authenticated user found',
      })
    }
  }
}
