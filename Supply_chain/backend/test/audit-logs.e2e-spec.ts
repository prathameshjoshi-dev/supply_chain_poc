import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
const request = require('supertest');
import { AppModule } from '../src/app.module';

describe('AuditLogsController (e2e)', () => {
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

  it('/api/v1/audit-logs (GET) - fetch paginated logs', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/audit-logs?page=1&limit=5')
      .expect(200);
      
    expect(response.body).toBeDefined();
    expect(response.body.data).toBeDefined();
    expect(Array.isArray(response.body.data)).toBeTruthy();
    expect(response.body.total).toBeDefined();
    expect(response.body.stats).toBeDefined();
    expect(response.body.page).toEqual(1);
    expect(response.body.limit).toEqual(5);
  });

  it('/api/v1/audit-logs (GET) - test filter action', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/audit-logs?action=CREATE')
      .expect(200);

    const logs = response.body.data;
    if (logs.length > 0) {
      logs.forEach((log: any) => {
        expect(log.action).toEqual('CREATE');
      });
    }
  });
});
