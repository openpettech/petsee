import { Test, TestingModule } from '@nestjs/testing';

import { EventsService, CacheService, PrismaService } from '@modules/core';

import { DocumentTemplateService } from './document-template.service';

describe('DocumentTemplateService', () => {
  let service: DocumentTemplateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentTemplateService,
        { provide: CacheService, useValue: {} },
        { provide: PrismaService, useValue: {} },
        { provide: EventsService, useValue: {} },
      ],
    }).compile();

    service = module.get<DocumentTemplateService>(DocumentTemplateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
