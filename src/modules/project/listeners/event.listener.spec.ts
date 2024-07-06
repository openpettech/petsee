import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';

import { WebhookEventListener } from './event.listener';
import { WebhookService, WebhookLogService } from '../services';
describe('WebhookEventListener', () => {
  let service: WebhookEventListener;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebhookEventListener,
        {
          provide: WebhookService,
          useValue: {},
        },
        {
          provide: WebhookLogService,
          useValue: {},
        },
        {
          provide: HttpService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<WebhookEventListener>(WebhookEventListener);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
