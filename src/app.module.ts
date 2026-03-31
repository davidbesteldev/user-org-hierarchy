import { Module } from '@nestjs/common'
import { OpenTelemetryModule } from 'nestjs-otel'

import { EnvModule } from '@app/core/config'
import { DatabaseModule } from '@app/core/database/database.module'
import { CustomLoggerModule } from '@app/core/logger/logger.module'
import { GroupModule } from '@app/modules/groups/group.module'
import { HealthModule } from '@app/modules/health/health.module'
import { NodeModule } from '@app/modules/nodes/node.module'
import { UserModule } from '@app/modules/users/user.module'

const OpenTelemetryModuleConfig = OpenTelemetryModule.forRoot({
  metrics: { hostMetrics: true },
})

@Module({
  imports: [
    OpenTelemetryModuleConfig,
    CustomLoggerModule,
    EnvModule,
    DatabaseModule,
    HealthModule,
    UserModule,
    GroupModule,
    NodeModule,
  ],
})
export class AppModule {}
