import { Test, TestingModule } from '@nestjs/testing';

import { EventsService, CacheService, PrismaService } from '@modules/core';

import { ServiceOverrideService } from './service-override.service';

describe('ServiceOverrideService', () => {
  let service: ServiceOverrideService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceOverrideService,
        { provide: CacheService, useValue: {} },
        { provide: PrismaService, useValue: {} },
        { provide: EventsService, useValue: {} },
      ],
    }).compile();

    service = module.get<ServiceOverrideService>(ServiceOverrideService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
