import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  // Create an application context rather than a full HTTP server
  const app = await NestFactory.createApplicationContext(AppModule);
  const userModel = app.get<Model<User>>(getModelToken(User.name));

  console.log('Seeding database...');
  
  // Clear existing users
  await userModel.deleteMany({});

  const passwordHash = await bcrypt.hash('password123', 10);

  const users = [
    {
      name: 'System Admin',
      email: 'admin@nexus.logistics',
      passwordHash,
      role: 'admin',
      warehouseIds: ['WH-1', 'WH-2', 'WH-3'],
      status: 'active',
    },
    {
      name: 'Warehouse Manager',
      email: 'manager@nexus.logistics',
      passwordHash,
      role: 'manager',
      warehouseIds: ['WH-1'],
      status: 'active',
    },
    {
      name: 'Floor Supervisor',
      email: 'supervisor@nexus.logistics',
      passwordHash,
      role: 'supervisor',
      warehouseIds: ['WH-2'],
      status: 'active',
    },
    {
      name: 'Logistics Viewer',
      email: 'viewer@nexus.logistics',
      passwordHash,
      role: 'viewer',
      warehouseIds: [],
      status: 'active',
    }
  ];

  await userModel.insertMany(users);
  
  console.log('Seeding complete! Added mock users.');
  
  await app.close();
}

bootstrap().catch(err => {
  console.error('Seeding failed!', err);
  process.exit(1);
});
