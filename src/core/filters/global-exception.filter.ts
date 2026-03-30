import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
  HttpStatus,
} from '@nestjs/common'
import { Response, Request } from 'express'

import { Prisma } from '@generated/prisma/client'

import { AppErrorResponse } from '@app/shared/errors/app-response.error'

interface ErrorResponse {
  message: string | string[]
}

interface ExtendedPrismaError extends Error {
  code?: string
  cause?: { code?: string }
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR
    let message: string | string[] = 'Internal server error'

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus()
      const responseBody = exception.getResponse()

      if (
        typeof responseBody === 'object' &&
        responseBody !== null &&
        'message' in responseBody
      ) {
        message = (responseBody as ErrorResponse).message
      } else {
        message = exception.message
      }
    } else if (this.isPrismaError(exception)) {
      const prismaError = this.handlePrismaError(exception)
      statusCode = prismaError.status
      message = prismaError.message
    }

    const errorResponse = new AppErrorResponse(statusCode, message, request.url)

    this.logger.error(
      `[${statusCode}] ${JSON.stringify(message)} on path ${request.url}`,
      exception instanceof Error ? exception.stack : String(exception),
    )

    response.status(statusCode).json(errorResponse)
  }

  private isPrismaError(
    exception: unknown,
  ): exception is Prisma.PrismaClientKnownRequestError | ExtendedPrismaError {
    if (
      exception instanceof Prisma.PrismaClientKnownRequestError ||
      exception instanceof Prisma.PrismaClientUnknownRequestError ||
      exception instanceof Prisma.PrismaClientValidationError
    ) {
      return true
    }

    if (typeof exception === 'object' && exception !== null) {
      const err = exception as ExtendedPrismaError
      return (
        err.name === 'DriverAdapterError' ||
        (!!err.constructor && err.constructor.name === 'DriverAdapterError')
      )
    }

    return false
  }

  private handlePrismaError(
    exception: Prisma.PrismaClientKnownRequestError | ExtendedPrismaError,
  ): {
    status: number
    message: string | string[]
  } {
    let code = exception.code

    if (exception instanceof Prisma.PrismaClientValidationError) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Database validation failed. Check your input data.',
      }
    }

    if (
      exception.name === 'DriverAdapterError' ||
      (exception.constructor && exception.constructor.name === 'DriverAdapterError')
    ) {
      code = (exception as ExtendedPrismaError).cause?.code
    }

    switch (code) {
      case '22P02':
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Invalid input syntax for UUID.',
        }

      case 'P2002':
        return {
          status: HttpStatus.CONFLICT,
          message: 'Unique constraint failed on one or more fields.',
        }

      case 'P2025':
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'Record not found.',
        }

      default:
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: `Database error: ${code || 'Unknown'}`,
        }
    }
  }
}
