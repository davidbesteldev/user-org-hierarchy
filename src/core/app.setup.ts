import { INestApplication, ValidationPipe } from '@nestjs/common'
import { json, urlencoded } from 'express'
import { LoggerErrorInterceptor } from 'nestjs-pino'

import { swaggerConfig } from '@app/core/config'
import { GlobalExceptionFilter } from '@app/core/filters/global-exception.filter'

export const setupApp = (app: INestApplication) => {
  app.enableShutdownHooks()

  app.use(json({ limit: '1mb' }))
  app.use(urlencoded({ limit: '1mb', extended: false }))

  app.useGlobalInterceptors(new LoggerErrorInterceptor())

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }))

  app.enableCors({ origin: '*' })

  app.useGlobalFilters(new GlobalExceptionFilter())

  swaggerConfig(app)
}
