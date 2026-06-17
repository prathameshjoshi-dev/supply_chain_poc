import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('WorkflowsController (e2e)', () => {
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

  describe('GET /api/v1/workflows', () => {
    it('should return workflows', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/workflows')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should filter by status', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/workflows?status=Open')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.every(w => w.status === 'Open')).toBe(true);
    });
  });

  describe('POST /api/v1/workflows', () => {
    it('should create a new workflow task', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/workflows')
        .send({
          category: 'Replenishment',
          priority: 'High',
          assignee: 'John Doe',
          relatedEntityId: 'SKU-123',
          dueAt: new Date().toISOString(),
          notes: 'Test creation'
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.taskId).toMatch(/^NX-\d+$/);
      expect(response.body.data.priority).toBe('High Priority');
      expect(response.body.data.status).toBe('Open');
    });
  });

  describe('POST /api/v1/workflows/:taskId/complete', () => {
    it('should complete a workflow', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/workflows/NX-7215/complete')
        .expect(201); // Created (Nest defaults POST to 201)

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('Resolved');
    });
  });
});
