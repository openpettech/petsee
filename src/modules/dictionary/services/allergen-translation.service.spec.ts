import { Test, TestingModule } from '@nestjs/testing';

import { CacheService, PrismaService } from '@modules/core';

import { AllergenTranslationService } from './allergen-translation.service';

describe('AllergenTranslationService', () => {
  let service: AllergenTranslationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AllergenTranslationService,
        { provide: CacheService, useValue: {} },
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<AllergenTranslationService>(
      AllergenTranslationService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
