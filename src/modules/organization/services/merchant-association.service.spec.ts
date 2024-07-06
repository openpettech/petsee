import { Test, TestingModule } from '@nestjs/testing';

import { EventsService, CacheService, PrismaService } from '@modules/core';

import { MerchantAssociationService } from './merchant-association.service';

describe('MerchantAssociationService', () => {
  let service: MerchantAssociationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MerchantAssociationService,
        { provide: CacheService, useValue: {} },
        { provide: PrismaService, useValue: {} },
        { provide: EventsService, useValue: {} },
      ],
    }).compile();

    service = module.get<MerchantAssociationService>(
      MerchantAssociationService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
