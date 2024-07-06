import { Test, TestingModule } from '@nestjs/testing';

import { EventsService, CacheService, PrismaService } from '@modules/core';

import { WarehouseService } from './warehouse.service';

describe('WarehouseService', () => {
  let service: WarehouseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WarehouseService,
        { provide: CacheService, useValue: {} },
        { provide: PrismaService, useValue: {} },
        { provide: EventsService, useValue: {} },
      ],
    }).compile();

    service = module.get<WarehouseService>(WarehouseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
