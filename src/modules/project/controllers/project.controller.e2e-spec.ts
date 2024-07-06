import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { AppModule } from '../../../app.module';

describe('ProjectController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it(`/GET projects`, () => {
    return request(app.getHttpServer()).get('/projects').expect(200).expect({
      data: [],
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
