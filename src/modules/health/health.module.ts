import { Module } from '@nestjs/common'
import { TerminusModule } from '@nestjs/terminus'

import { DatabaseModule } from '@app/core/database/database.module'
import { HealthController } from '@app/modules/health/health.controller'

@Module({
  imports: [TerminusModule, DatabaseModule],
  controllers: [HealthController],
})
export class HealthModule {}
