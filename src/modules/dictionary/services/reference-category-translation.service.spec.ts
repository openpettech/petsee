import { Test, TestingModule } from '@nestjs/testing';

import { CacheService, PrismaService } from '@modules/core';

import { ReferenceCategoryTranslationService } from './reference-category-translation.service';

describe('ReferenceCategoryTranslationService', () => {
  let service: ReferenceCategoryTranslationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReferenceCategoryTranslationService,
        { provide: CacheService, useValue: {} },
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<ReferenceCategoryTranslationService>(
      ReferenceCategoryTranslationService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
