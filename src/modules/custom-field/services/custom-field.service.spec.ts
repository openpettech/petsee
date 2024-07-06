import { Test, TestingModule } from '@nestjs/testing';

import { EventsService, CacheService, PrismaService } from '@modules/core';

import { CustomFieldService } from './custom-field.service';

describe('CustomFieldService', () => {
  let service: CustomFieldService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomFieldService,
        { provide: CacheService, useValue: {} },
        { provide: PrismaService, useValue: {} },
        { provide: EventsService, useValue: {} },
      ],
    }).compile();

    service = module.get<CustomFieldService>(CustomFieldService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
