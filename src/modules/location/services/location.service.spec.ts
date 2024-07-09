import { Test, TestingModule } from '@nestjs/testing';

import { EventsService, CacheService, PrismaService } from '@modules/core';

import { LocationService } from './location.service';

describe('LocationService', () => {
  let service: LocationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationService,
        { provide: CacheService, useValue: {} },
        { provide: PrismaService, useValue: {} },
        { provide: EventsService, useValue: {} },
      ],
    }).compile();

    service = module.get<LocationService>(LocationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
