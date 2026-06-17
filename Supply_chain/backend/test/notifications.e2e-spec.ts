import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppNotification } from '../src/modules/notifications/schemas/notification.schema';
import { NotificationPreference } from '../src/modules/notifications/schemas/notification-preference.schema';

describe('NotificationsController (e2e)', () => {
  let app: INestApplication;
  let notificationModel: Model<AppNotification>;
  let preferenceModel: Model<NotificationPreference>;

  jest.setTimeout(30000);

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    notificationModel = moduleFixture.get<Model<AppNotification>>(getModelToken(AppNotification.name));
    preferenceModel = moduleFixture.get<Model<NotificationPreference>>(getModelToken(NotificationPreference.name));
    
    await notificationModel.deleteMany({});
    await preferenceModel.deleteMany({});
    
    // Seed some test notifications
    await notificationModel.insertMany([
      { title: 'Test 1', message: 'Message 1', severity: 'critical', category: 'Shipment', entityId: 'T-1', read: false },
      { title: 'Test 2', message: 'Message 2', severity: 'info', category: 'Workflow', entityId: 'T-2', read: false },
    ]);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/v1/notifications', () => {
    it('should return paginated notifications and counts', () => {
      return request(app.getHttpServer())
        .get('/api/v1/notifications')
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toBeInstanceOf(Array);
          expect(res.body.data.length).toBeGreaterThanOrEqual(2);
          expect(res.body.stats).toBeDefined();
          expect(res.body.stats.critical).toBeGreaterThanOrEqual(1);
        });
    });
  });

  describe('PATCH /api/v1/notifications/:id/read', () => {
    it('should mark a notification as read (KPI NOTIF-03)', async () => {
      const notif = await notificationModel.findOne({ read: false });
      
      const res = await request(app.getHttpServer())
        .patch(`/api/v1/notifications/${notif._id}/read`)
        .expect(200);
        
      expect(res.body.read).toBe(true);
      
      const dbNotif = await notificationModel.findById(notif._id);
      expect(dbNotif.read).toBe(true);
    });
  });

  describe('PATCH /api/v1/notifications/read-all', () => {
    it('should mark all notifications as read', async () => {
      const res = await request(app.getHttpServer())
        .patch('/api/v1/notifications/read-all')
        .expect(200);
        
      expect(res.body.updatedCount).toBeDefined();
      
      const unreadCount = await notificationModel.countDocuments({ read: false });
      expect(unreadCount).toBe(0);
    });
  });

  describe('Preferences', () => {
    const testUserId = 'test-user-e2e';

    it('should create default preferences if none exist', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/notifications/preferences?userId=${testUserId}`)
        .expect(200);
        
      expect(res.body.inAppPush).toBe(true);
      expect(res.body.emailDigests).toBe(false);
    });

    it('should update preferences accurately (KPI NOTIF-04)', async () => {
      const res = await request(app.getHttpServer())
        .put('/api/v1/notifications/preferences')
        .send({ userId: testUserId, inAppPush: false, emailDigests: true, smsAlerts: true })
        .expect(200);
        
      expect(res.body.inAppPush).toBe(false);
      expect(res.body.emailDigests).toBe(true);
      expect(res.body.smsAlerts).toBe(true);
      
      const dbPref = await preferenceModel.findOne({ userId: testUserId });
      expect(dbPref.inAppPush).toBe(false);
      expect(dbPref.emailDigests).toBe(true);
    });
  });
});
