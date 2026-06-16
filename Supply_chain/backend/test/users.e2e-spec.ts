import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { UsersController } from '../src/modules/users/controllers/users.controller';
import { UsersService } from '../src/modules/users/services/users.service';

describe('UsersModule (e2e)', () => {
  let app: INestApplication;
  
  const mockUsersService = {
    findAll: jest.fn(),
    getInsights: jest.fn(),
    bulkAction: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/v1/users', () => {
    it('should return paginated users', async () => {
      mockUsersService.findAll.mockResolvedValue({
        data: [{ id: '1', name: 'Test' }],
        total: 1,
        page: 1,
        limit: 10,
      });

      const res = await request(app.getHttpServer())
        .get('/api/v1/users')
        .query({ page: 1, limit: 10 });
      
      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
      expect(mockUsersService.findAll).toHaveBeenCalledWith({ page: '1', limit: '10' });
    });
  });

  describe('GET /api/v1/users/insights', () => {
    it('should return user insights', async () => {
      mockUsersService.getInsights.mockResolvedValue({
        totalCapacity: 100,
        adminAccounts: 10,
        activePercentage: 90,
      });

      const res = await request(app.getHttpServer())
        .get('/api/v1/users/insights');
      
      expect(res.status).toBe(200);
      expect(res.body.totalCapacity).toBe(100);
    });
  });

  describe('POST /api/v1/users/bulk-action', () => {
    it('should execute bulk action successfully', async () => {
      mockUsersService.bulkAction.mockResolvedValue({ modifiedCount: 2 });

      const res = await request(app.getHttpServer())
        .post('/api/v1/users/bulk-action')
        .send({ userIds: ['1', '2'], action: 'delete' });
      
      expect(res.status).toBe(201); // default POST status
      expect(res.body.modifiedCount).toBe(2);
    });

    it('should fail with validation error if action is invalid', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/users/bulk-action')
        .send({ userIds: ['1'], action: 'invalid_action' });
      
      expect(res.status).toBe(400);
    });
  });
});
