import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  HealthCheckService,
  MemoryHealthIndicator,
  PrismaHealthIndicator,
  HealthCheck,
} from '@nestjs/terminus';
import { PrismaService } from '@modules/core';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly prisma: PrismaHealthIndicator,
    private readonly prismaService: PrismaService,
    private readonly memory: MemoryHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  public check() {
    return this.health.check([
      () => this.prisma.pingCheck('prisma', this.prismaService),
      () => this.memory.checkRSS('mem_rss', 1024 * 2 ** 20 /* 1024 MB */),
    ]);
  }
}
