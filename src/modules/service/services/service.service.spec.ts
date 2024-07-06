import { Test, TestingModule } from '@nestjs/testing';

import { EventsService, CacheService, PrismaService } from '@modules/core';

import { ServiceService } from './service.service';

describe('ServiceService', () => {
  let service: ServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceService,
        { provide: CacheService, useValue: {} },
        { provide: PrismaService, useValue: {} },
        { provide: EventsService, useValue: {} },
      ],
    }).compile();

    service = module.get<ServiceService>(ServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
