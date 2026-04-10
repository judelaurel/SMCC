import { HttpContext } from '@adonisjs/core/http'
import { Exception } from '@adonisjs/core/exceptions'

export default class NotFoundException extends Exception {
  static status = 404
  static code = 'E_NOT_FOUND'

  // Add a property to store number of login attempts
  loginAttempts?: string

  constructor(message?: string, loginAttempts?: string) {
    super(message)

    if (loginAttempts !== undefined) this.loginAttempts = loginAttempts
  }

  async handle(error: this, ctx: HttpContext) {
    const responseData: any = {
      status: 'error',
      message: error.message,
      data: {
        code: error.code,
      },
    }

    // Conditionally include loginAttempts if it exists
    if (error.loginAttempts !== undefined) responseData.data.loginAttempts = error.loginAttempts

    ctx.response.status(error.status).json(responseData)
  }

  async report(error: this, ctx: HttpContext) {
    ctx.logger.error({ err: error }, error.message)
  }
}
