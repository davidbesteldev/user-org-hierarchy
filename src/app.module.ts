import { Module } from '@nestjs/common'

import { EnvModule } from '@app/core/config'
import { DatabaseModule } from '@app/core/database/database.module'
import { GroupModule } from '@app/modules/groups/group.module'
import { HealthModule } from '@app/modules/health/health.module'
import { NodeModule } from '@app/modules/nodes/node.module'
import { UserModule } from '@app/modules/users/user.module'

@Module({
  imports: [EnvModule, DatabaseModule, HealthModule, UserModule, GroupModule, NodeModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
