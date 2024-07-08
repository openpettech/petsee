import { Test, TestingModule } from '@nestjs/testing';

import { EventsService, CacheService, PrismaService } from '@modules/core';

import { DocumentTemplateFieldService } from './document-template-field.service';

describe('DocumentTemplateFieldService', () => {
  let service: DocumentTemplateFieldService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentTemplateFieldService,
        { provide: CacheService, useValue: {} },
        { provide: PrismaService, useValue: {} },
        { provide: EventsService, useValue: {} },
      ],
    }).compile();

    service = module.get<DocumentTemplateFieldService>(
      DocumentTemplateFieldService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
