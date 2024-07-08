import { Test, TestingModule } from '@nestjs/testing';

import { EventsService, CacheService, PrismaService } from '@modules/core';

import { DocumentFieldDataService } from './document-field-data.service';

describe('DocumentFieldDataService', () => {
  let service: DocumentFieldDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentFieldDataService,
        { provide: CacheService, useValue: {} },
        { provide: PrismaService, useValue: {} },
        { provide: EventsService, useValue: {} },
      ],
    }).compile();

    service = module.get<DocumentFieldDataService>(DocumentFieldDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
