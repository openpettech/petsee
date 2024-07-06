import { Test, TestingModule } from '@nestjs/testing';

import { CacheService, PrismaService } from '@modules/core';

import { ReferenceValueService } from './reference-value.service';

describe('ReferenceValueService', () => {
  let service: ReferenceValueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReferenceValueService,
        { provide: CacheService, useValue: {} },
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<ReferenceValueService>(ReferenceValueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
