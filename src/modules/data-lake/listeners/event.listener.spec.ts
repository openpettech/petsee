import { Test, TestingModule } from '@nestjs/testing';

import { DataLakeEventListener } from './event.listener';
import { ObjectStorageService } from '@modules/core';

describe('DataLakeEventListener', () => {
  let service: DataLakeEventListener;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DataLakeEventListener,
        {
          provide: ObjectStorageService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<DataLakeEventListener>(DataLakeEventListener);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
