import { Module } from '@nestjs/common'

import { DatabaseModule } from '@app/core/database/database.module'
import { GroupController } from '@app/modules/groups/group.controller'
import { GroupService } from '@app/modules/groups/group.service'

import * as useCases from './use-cases'

@Module({
  imports: [DatabaseModule],
  controllers: [GroupController],
  providers: [...Object.values(useCases), GroupService],
  exports: [],
})
export class GroupModule {}
