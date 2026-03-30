import { Module } from '@nestjs/common'

import { EnvModule } from '@app/core/config'
import { DatabaseModule } from '@app/core/database/database.module'
import { HealthModule } from '@app/modules/health/health.module'

@Module({
  imports: [EnvModule, DatabaseModule, HealthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
