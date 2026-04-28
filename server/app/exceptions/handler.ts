import app from '@adonisjs/core/services/app';
import { type HttpContext, ExceptionHandler } from '@adonisjs/core/http';
import NotFoundException from '#exceptions/not_found_exception';
import ForbiddenException from './forbidden_exception.ts';
import UnauthorizedException from './unauthorized_exception.ts';
import logger from '@adonisjs/core/services/logger';
import { ValidationError } from '@vinejs/vine';
import { errors as authErrors } from '@adonisjs/auth';

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction;

  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  async handle(error: unknown, ctx: HttpContext) {
    const { response } = ctx;

    const errorHandlers = [
      {
        error: UnauthorizedException,
        status: 401,
        code: 'ERR_UNAUTHORIZED',
      },
      {
        error: ForbiddenException,
        status: 403,
        code: 'ERR_FORBIDDEN',
      },
      {
        error: NotFoundException,
        status: 404,
        code: 'ERR_NOT_FOUND',
      },
      {
        error: ValidationError,
        status: 422,
        code: 'ERR_UNPROCESSABLE_ENTITY',
      },
    ] as const;

    console.log(error);

    for (const { error: ExceptionClass, status, code } of errorHandlers) {
      if (
        (ExceptionClass === ValidationError &&
          error instanceof ValidationError) ||
        error instanceof authErrors.E_INVALID_CREDENTIALS
      ) {
        return super.handle(error, ctx);
      }

      if (error instanceof ExceptionClass) {
        return response.status(status).send({
          status: code,
          message: (error as any).message,
        });
      }
    }

    logger.error({ err: error }, 'Unhandled exception occurred');

    // fallback
    return response.status(500).send({
      status: 'ERR_INTERNAL_SERVER',
      message: 'Internal server error',
    });
  }

  /**
   * The method is used to report error to the logging service or
   * the a third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx);
  }
}
