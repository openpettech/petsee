import { Test, TestingModule } from '@nestjs/testing';

import { EventsService, CacheService, PrismaService } from '@modules/core';

import { GroupAssociationService } from './group-association.service';

describe('GroupAssociationService', () => {
  let service: GroupAssociationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupAssociationService,
        { provide: CacheService, useValue: {} },
        { provide: PrismaService, useValue: {} },
        { provide: EventsService, useValue: {} },
      ],
    }).compile();

    service = module.get<GroupAssociationService>(GroupAssociationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
