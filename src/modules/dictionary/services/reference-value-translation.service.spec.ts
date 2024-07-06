import { Test, TestingModule } from '@nestjs/testing';

import { CacheService, PrismaService } from '@modules/core';

import { ReferenceValueTranslationService } from './reference-value-translation.service';

describe('ReferenceValueTranslationService', () => {
  let service: ReferenceValueTranslationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReferenceValueTranslationService,
        { provide: CacheService, useValue: {} },
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<ReferenceValueTranslationService>(
      ReferenceValueTranslationService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
