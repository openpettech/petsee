import { Test, TestingModule } from '@nestjs/testing';

import { EventsService, CacheService, PrismaService } from '@modules/core';
import { TagService } from '@modules/tag';

import { CustomerService } from './customer.service';

describe('CustomerService', () => {
  let service: CustomerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        { provide: CacheService, useValue: {} },
        { provide: PrismaService, useValue: {} },
        { provide: EventsService, useValue: {} },
        { provide: TagService, useValue: {} },
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
