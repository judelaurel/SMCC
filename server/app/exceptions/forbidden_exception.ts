import { HttpContext } from '@adonisjs/core/http'
import { Exception } from '@adonisjs/core/exceptions'

export default class ForbiddenException extends Exception {
  static status = 403
  static code = 'E_FORBIDDEN'

  async handle(error: this, ctx: HttpContext) {
    ctx.response.status(error.status).json({
      status: 'error',
      message: error.message,
      data: {
        code: error.code,
      },
    })
  }

  async report(error: this, ctx: HttpContext) {
    ctx.logger.error({ err: error }, error.message)
  }
}
