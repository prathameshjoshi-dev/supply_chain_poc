import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('InventoryController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    
    // Allow DB seeding to complete
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/v1/inventory', () => {
    it('should return paginated inventory items', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/inventory')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.meta).toBeDefined();
    });

    it('should search inventory items', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/inventory?search=NX-9021')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].sku).toBe('NX-9021');
    });
  });

  describe('GET /api/v1/inventory/kpis', () => {
    it('should return KPI summary', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/inventory/kpis')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.totalSkus).toBeDefined();
      expect(response.body.data.lowStockItems).toBeDefined();
      expect(response.body.data.excessStock).toBeDefined();
    });
  });

  describe('POST /api/v1/inventory/:sku/restock', () => {
    it('should restock an item', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/inventory/NX-9021/restock')
        .expect(201); // created/success

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('In Stock');
      expect(response.body.data.currentQty).toBeGreaterThan(0);
    });

    it('should return 404 for unknown sku', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/inventory/UNKNOWN-SKU/restock')
        .expect(404);
    });
  });
});
