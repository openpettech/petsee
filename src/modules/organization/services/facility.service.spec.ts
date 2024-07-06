import { Test, TestingModule } from '@nestjs/testing';

import { EventsService, CacheService, PrismaService } from '@modules/core';

import { FacilityService } from './facility.service';

describe('FacilityService', () => {
  let service: FacilityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FacilityService,
        { provide: CacheService, useValue: {} },
        { provide: PrismaService, useValue: {} },
        { provide: EventsService, useValue: {} },
      ],
    }).compile();

    service = module.get<FacilityService>(FacilityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
