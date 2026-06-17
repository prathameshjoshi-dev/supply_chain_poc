import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
const request = require('supertest');

describe('RolesController (e2e)', () => {
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

  let adminRoleId: string;

  it('/api/v1/roles (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/roles')
      .expect(200);
      
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBeGreaterThan(0);
    
    const adminRole = response.body.find((r: any) => r.name === 'admin');
    expect(adminRole).toBeDefined();
    expect(adminRole.permissions).toContain('auth.mfa_enforce');
    
    adminRoleId = adminRole._id;
  });

  it('/api/v1/roles/:id (PATCH)', async () => {
    // Modify admin role permissions
    const updateResponse = await request(app.getHttpServer())
      .patch(`/api/v1/roles/${adminRoleId}`)
      .send({ permissions: ['auth.mfa_enforce', 'test.custom'] })
      .expect(200);

    expect(updateResponse.body.permissions).toContain('test.custom');
    expect(updateResponse.body.permissions).not.toContain('user.create'); // Should be removed since it wasn't in the update list

    // Restore admin role to prevent breaking app behavior in other tests
    await request(app.getHttpServer())
      .patch(`/api/v1/roles/${adminRoleId}`)
      .send({ permissions: [
        'auth.mfa_enforce', 'auth.api_keys', 'auth.password_override', 'auth.global_logout',
        'user.create', 'user.modify_rbac', 'user.bulk_import', 'user.delete_core',
        'workflow.pipeline', 'workflow.critical_alert',
        'report.financial', 'report.ai_finetune'
      ] })
      .expect(200);
  });
});
