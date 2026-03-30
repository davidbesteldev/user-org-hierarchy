import { Global, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { EnvService } from '@app/core/config/env/env.service'
import { envValidation } from '@app/core/config/env/env.validation'

@Global()
@Module({
  imports: [ConfigModule.forRoot({ validate: envValidation })],
  providers: [EnvService],
  exports: [EnvService],
})
export class EnvModule {}
