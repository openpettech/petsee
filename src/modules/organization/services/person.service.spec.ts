import { Test, TestingModule } from '@nestjs/testing';

import { EventsService, CacheService, PrismaService } from '@modules/core';

import { PersonService } from './person.service';

describe('PersonService', () => {
  let service: PersonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PersonService,
        { provide: CacheService, useValue: {} },
        { provide: PrismaService, useValue: {} },
        { provide: EventsService, useValue: {} },
      ],
    }).compile();

    service = module.get<PersonService>(PersonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
