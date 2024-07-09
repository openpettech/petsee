import { Test, TestingModule } from '@nestjs/testing';

import { EventsService, CacheService, PrismaService } from '@modules/core';

import { ShiftTypeService } from './shift-type.service';

describe('ShiftTypeService', () => {
  let service: ShiftTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShiftTypeService,
        { provide: CacheService, useValue: {} },
        { provide: PrismaService, useValue: {} },
        { provide: EventsService, useValue: {} },
      ],
    }).compile();

    service = module.get<ShiftTypeService>(ShiftTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
