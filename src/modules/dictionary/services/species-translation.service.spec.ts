import { Test, TestingModule } from '@nestjs/testing';

import { CacheService, PrismaService } from '@modules/core';

import { SpeciesTranslationService } from './species-translation.service';

describe('SpeciesTranslationService', () => {
  let service: SpeciesTranslationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpeciesTranslationService,
        { provide: CacheService, useValue: {} },
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<SpeciesTranslationService>(SpeciesTranslationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
