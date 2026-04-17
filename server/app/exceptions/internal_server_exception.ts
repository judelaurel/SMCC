import { HttpContext } from '@adonisjs/core/http'
import { Exception } from '@adonisjs/core/exceptions'

export default class InternalServerException extends Exception {
  static status = 500
  static code = 'ERR_INTERNAL_SERVER'

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
