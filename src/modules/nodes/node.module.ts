import { Module } from '@nestjs/common'

import { DatabaseModule } from '@app/core/database/database.module'
import { NodeController } from '@app/modules/nodes/node.controller'
import { NodeService } from '@app/modules/nodes/node.service'

import * as useCases from './use-cases'

@Module({
  imports: [DatabaseModule],
  controllers: [NodeController],
  providers: [...Object.values(useCases), NodeService],
  exports: [],
})
export class NodeModule {}
