import { Module } from '@nestjs/common'

import { EnvModule } from '@app/core/config'
import { DatabaseModule } from '@app/core/database/database.module'

@Module({
  imports: [EnvModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
