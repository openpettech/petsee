import { Test, TestingModule } from '@nestjs/testing';

import { EventsService, CacheService, PrismaService } from '@modules/core';

import { StockLedgerService } from './stock-ledger.service';

describe('StockLedgerService', () => {
  let service: StockLedgerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StockLedgerService,
        { provide: CacheService, useValue: {} },
        { provide: PrismaService, useValue: {} },
        { provide: EventsService, useValue: {} },
      ],
    }).compile();

    service = module.get<StockLedgerService>(StockLedgerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
