import { Test, TestingModule } from '@nestjs/testing';

import { EventsService, CacheService, PrismaService } from '@modules/core';

import { WebhookLogService } from './webhook-log.service';

describe('WebhookLogService', () => {
  let service: WebhookLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebhookLogService,
        { provide: CacheService, useValue: {} },
        { provide: PrismaService, useValue: {} },
        { provide: EventsService, useValue: {} },
      ],
    }).compile();

    service = module.get<WebhookLogService>(WebhookLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
