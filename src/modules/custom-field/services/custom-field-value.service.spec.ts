import { Test, TestingModule } from '@nestjs/testing';

import { EventsService, CacheService, PrismaService } from '@modules/core';

import { CustomFieldValueService } from './custom-field-value.service';
import { CustomFieldOptionService } from './custom-field-option.service';
import { CustomFieldService } from './custom-field.service';

describe('CustomFieldValueService', () => {
  let service: CustomFieldValueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomFieldValueService,
        { provide: CacheService, useValue: {} },
        { provide: PrismaService, useValue: {} },
        { provide: EventsService, useValue: {} },
        { provide: CustomFieldOptionService, useValue: {} },
        { provide: CustomFieldService, useValue: {} },
      ],
    }).compile();

    service = module.get<CustomFieldValueService>(CustomFieldValueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
