import { Module } from '@nestjs/common'

import { EnvModule } from '@app/core/config'
import { DatabaseModule } from '@app/core/database/database.module'
import { GroupModule } from '@app/modules/groups/group.module'
import { HealthModule } from '@app/modules/health/health.module'

@Module({
  imports: [EnvModule, DatabaseModule, HealthModule, GroupModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
