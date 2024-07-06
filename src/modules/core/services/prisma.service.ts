import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { readReplicas } from '@prisma/extension-read-replicas';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  async onModuleInit() {
    let replicaUrl = '';

    replicaUrl = this.configService?.get('DATABASE_REPLICA_URL_1') as string;

    this.$extends(
      readReplicas({
        url: [replicaUrl],
      }),
    );

    await this.$connect();
  }
}
