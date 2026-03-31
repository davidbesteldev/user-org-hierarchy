import { Module } from '@nestjs/common'

import { DatabaseModule } from '@app/core/database/database.module'
import { UserController } from '@app/modules/users/user.controller'
import { UserService } from '@app/modules/users/user.service'

import * as useCases from './use-cases'

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [...Object.values(useCases), UserService],
  exports: [],
})
export class UserModule {}
