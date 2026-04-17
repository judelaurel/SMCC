import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'

export default class UnauthorizedException extends Exception {
  static status = 401
  static code = 'ERR_UNAUTHORIZED'

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