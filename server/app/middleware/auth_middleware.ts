import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Authenticators } from '@adonisjs/auth/types'
import UnauthorizedException from '#exceptions/unauthorized_exception'

/**
 * Auth middleware is used authenticate HTTP requests and deny
 * access to unauthenticated users.
 */
export default class AuthMiddleware {

  redirectTo = '/login'

  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: {
      guards?: (keyof Authenticators)[]
    } = {}
  ) {
    try {
      await ctx.auth.authenticateUsing(options.guards, { loginRoute: this.redirectTo })
      await next()
    }
    catch (error) {
      throw new UnauthorizedException('Unauthorized access')
    }
  }
}
