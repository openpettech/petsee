import { Test, TestingModule } from '@nestjs/testing';

import { EventsService, CacheService, PrismaService } from '@modules/core';

import { MerchantService } from './merchant.service';

describe('MerchantService', () => {
  let service: MerchantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MerchantService,
        { provide: CacheService, useValue: {} },
        { provide: PrismaService, useValue: {} },
        { provide: EventsService, useValue: {} },
      ],
    }).compile();

    service = module.get<MerchantService>(MerchantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
