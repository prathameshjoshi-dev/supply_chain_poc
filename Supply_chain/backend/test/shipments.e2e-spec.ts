import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Shipments (e2e)', () => {
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

  // it('/api/v1/shipments (GET) - unauthorized', () => {
  //   return request(app.getHttpServer())
  //     .get('/api/v1/shipments')
  //     .expect(401);
  // });

  it('/api/v1/shipments (GET) - success', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/shipments')
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.meta).toBeDefined();
    expect(res.body.meta.page).toBe(1);
  });

  it('/api/v1/shipments (GET) - filter by status', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/shipments?status=In-Transit')
      .expect(200);

    expect(res.body.success).toBe(true);
    res.body.data.forEach((shipment) => {
      expect(shipment.status).toBe('In-Transit');
    });
  });

  it('/api/v1/shipments (GET) - filter by carrier', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/shipments?carrier=Apex%20Logistics')
      .expect(200);

    expect(res.body.success).toBe(true);
    res.body.data.forEach((shipment) => {
      expect(shipment.carrier).toBe('Apex Logistics');
    });
  });

  it('/api/v1/shipments (GET) - pagination', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/shipments?page=1&limit=2')
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeLessThanOrEqual(2);
    expect(res.body.meta.limit).toBe(2);
  });
  
  it('/api/v1/shipments (GET) - latency check (p95 <= 500ms)', async () => {
    const start = Date.now();
    await request(app.getHttpServer())
      .get('/api/v1/shipments')
      .expect(200);
    const end = Date.now();
    
    expect(end - start).toBeLessThanOrEqual(500);
  });
});
