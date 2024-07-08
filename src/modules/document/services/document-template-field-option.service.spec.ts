import { Test, TestingModule } from '@nestjs/testing';

import { EventsService, CacheService, PrismaService } from '@modules/core';

import { DocumentTemplateFieldOptionService } from './document-template-field-option.service';

describe('DocumentTemplateFieldOptionService', () => {
  let service: DocumentTemplateFieldOptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentTemplateFieldOptionService,
        { provide: CacheService, useValue: {} },
        { provide: PrismaService, useValue: {} },
        { provide: EventsService, useValue: {} },
      ],
    }).compile();

    service = module.get<DocumentTemplateFieldOptionService>(
      DocumentTemplateFieldOptionService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
