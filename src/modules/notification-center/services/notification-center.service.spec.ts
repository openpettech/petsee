import { Test, TestingModule } from '@nestjs/testing';

import { EventsService, CacheService, PrismaService } from '@modules/core';

import { NotificationCenterService } from './notification-center.service';

describe('NotificationCenterService', () => {
  let service: NotificationCenterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationCenterService,
        { provide: CacheService, useValue: {} },
        { provide: PrismaService, useValue: {} },
        { provide: EventsService, useValue: {} },
      ],
    }).compile();

    service = module.get<NotificationCenterService>(NotificationCenterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
