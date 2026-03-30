import { Controller, Get } from '@nestjs/common'
import { HealthCheck, HealthCheckService, PrismaHealthIndicator } from '@nestjs/terminus'

import { DatabaseService } from '@app/core/database/database.service'

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private prismaIndicator: PrismaHealthIndicator,
    private db: DatabaseService,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([() => this.prismaIndicator.pingCheck('database', this.db)])
  }
}
