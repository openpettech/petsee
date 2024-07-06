import { Test, TestingModule } from '@nestjs/testing';

import { EventsService, CacheService, PrismaService } from '@modules/core';

import { BrandService } from './brand.service';

describe('BrandService', () => {
  let service: BrandService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BrandService,
        { provide: CacheService, useValue: {} },
        { provide: PrismaService, useValue: {} },
        { provide: EventsService, useValue: {} },
      ],
    }).compile();

    service = module.get<BrandService>(BrandService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
