import { Test, TestingModule } from '@nestjs/testing';

import { CacheService, PrismaService } from '@modules/core';

import { BreedTranslationService } from './breed-translation.service';

describe('BreedTranslationService', () => {
  let service: BreedTranslationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BreedTranslationService,
        { provide: CacheService, useValue: {} },
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<BreedTranslationService>(BreedTranslationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
