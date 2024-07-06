import { Test, TestingModule } from '@nestjs/testing';

import { CacheService, PrismaService } from '@modules/core';

import { BloodGroupTranslationService } from './blood-group-translation.service';

describe('BloodGroupTranslationService', () => {
  let service: BloodGroupTranslationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BloodGroupTranslationService,
        { provide: CacheService, useValue: {} },
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<BloodGroupTranslationService>(
      BloodGroupTranslationService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
