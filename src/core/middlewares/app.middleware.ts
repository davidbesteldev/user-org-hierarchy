import { INestApplication, ValidationPipe } from '@nestjs/common'
import { json, urlencoded } from 'express'

import { swaggerConfig } from '@app/core/config'
import { GlobalExceptionFilter } from '@app/core/filters/global-exception.filter'

export const appMiddlewares = (app: INestApplication) => {
  app.use(json({ limit: '1mb' }))
  app.use(urlencoded({ limit: '1mb', extended: false }))

  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  app.enableCors({ origin: '*' })

  app.useGlobalFilters(new GlobalExceptionFilter())

  swaggerConfig(app)
}
