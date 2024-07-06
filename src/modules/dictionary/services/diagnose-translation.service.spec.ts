import { Test, TestingModule } from '@nestjs/testing';

import { CacheService, PrismaService } from '@modules/core';

import { DiagnoseTranslationService } from './diagnose-translation.service';

describe('DiagnoseTranslationService', () => {
  let service: DiagnoseTranslationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiagnoseTranslationService,
        { provide: CacheService, useValue: {} },
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<DiagnoseTranslationService>(
      DiagnoseTranslationService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
