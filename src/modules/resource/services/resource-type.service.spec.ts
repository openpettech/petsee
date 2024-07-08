import { Test, TestingModule } from '@nestjs/testing';

import { EventsService, CacheService, PrismaService } from '@modules/core';

import { ResourceTypeService } from './resource-type.service';

describe('ResourceTypeService', () => {
  let service: ResourceTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResourceTypeService,
        { provide: CacheService, useValue: {} },
        { provide: PrismaService, useValue: {} },
        { provide: EventsService, useValue: {} },
      ],
    }).compile();

    service = module.get<ResourceTypeService>(ResourceTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
