import otelSDK from '@app/tracing'
otelSDK.start()

import { NestFactory } from '@nestjs/core'
import { EventEmitter } from 'events'
import { Logger } from 'nestjs-pino'

import { AppModule } from '@app/app.module'
import { setupApp } from '@app/core/app.setup'
import { EnvService } from '@app/core/config'

EventEmitter.defaultMaxListeners = 20

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true })
  const { port, nodeEnv } = app.get(EnvService).get('app')

  const logger = app.get(Logger)
  app.useLogger(logger)

  setupApp(app)

  await app.listen(port)

  logger.log(`Server is running on port ${port} in ${nodeEnv} mode`, 'Bootstrap')
}

void bootstrap().catch((err) => {
  console.error('Fatal error during bootstrap:', err)
  process.exit(1)
})
