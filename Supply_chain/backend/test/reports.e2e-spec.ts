import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('ReportsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/v1/reports/scheduled', () => {
    it('should return scheduled reports', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/reports/scheduled')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/v1/reports/downloads', () => {
    it('should return recent downloads', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/reports/downloads')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('POST /api/v1/reports/generate', () => {
    it('should simulate generating a report', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/reports/generate')
        .send({ format: 'pdf' })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.type).toBe('pdf');
    });
  });
});
