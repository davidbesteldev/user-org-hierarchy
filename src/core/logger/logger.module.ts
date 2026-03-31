import ecsFormat from '@elastic/ecs-pino-format'
import { Module } from '@nestjs/common'
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino'
import { TransportTargetOptions } from 'pino'

import { EnvModule, EnvService } from '@app/core/config'
import { isIgnoredPath } from '@app/shared/config/monitoring.config'

@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: (envService: EnvService) => {
        const app = envService.get('app')
        const o11y = envService.get('o11y')

        const isProduction = app.nodeEnv === 'production'
        const ecsOptions = ecsFormat({ convertReqRes: true })

        // removed the 'level' format to avoid runtime errors with transport.
        if (ecsOptions.formatters) delete ecsOptions.formatters.level

        const targets: TransportTargetOptions[] = [
          {
            target: 'pino-elasticsearch',
            level: 'info',
            options: {
              node: o11y.elasticSearchUrl,
              index: `logs-${app.name}-${app.nodeEnv}`,
              esVersion: 8,
              op_type: 'create',
              flushInterval: 1000,
              connectionRetries: 5,
            },
          },
        ]

        if (!isProduction) {
          targets.push({
            target: 'pino-pretty',
            level: 'debug',
            options: {
              colorize: true,
              singleLine: true,
              translateTime: 'SYS:standard',
            },
          })
        }

        return {
          pinoHttp: {
            ...ecsOptions,
            level: isProduction ? 'info' : 'debug',
            autoLogging: { ignore: (req) => isIgnoredPath(req.url) },
            transport: { targets },
          },
        }
      },
    }),
  ],
  exports: [PinoLoggerModule],
})
export class CustomLoggerModule {}
