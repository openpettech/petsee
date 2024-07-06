import { Test, TestingModule } from '@nestjs/testing';

import { EventsService, CacheService, PrismaService } from '@modules/core';

import { CustomFieldOptionService } from './custom-field-option.service';

describe('CustomFieldOptionService', () => {
  let service: CustomFieldOptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomFieldOptionService,
        { provide: CacheService, useValue: {} },
        { provide: PrismaService, useValue: {} },
        { provide: EventsService, useValue: {} },
      ],
    }).compile();

    service = module.get<CustomFieldOptionService>(CustomFieldOptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
