import { Test, TestingModule } from '@nestjs/testing';

import { EventsService, CacheService, PrismaService } from '@modules/core';

import { AnimalRelationshipService } from './animal-relationship.service';

describe('AnimalRelationshipService', () => {
  let service: AnimalRelationshipService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnimalRelationshipService,
        { provide: CacheService, useValue: {} },
        { provide: PrismaService, useValue: {} },
        { provide: EventsService, useValue: {} },
      ],
    }).compile();

    service = module.get<AnimalRelationshipService>(AnimalRelationshipService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
