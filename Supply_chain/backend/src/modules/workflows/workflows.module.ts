import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkflowsController } from './controllers/workflows.controller';
import { WorkflowsService } from './services/workflows.service';
import { WorkflowTask, WorkflowTaskSchema } from './schemas/workflow-task.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WorkflowTask.name, schema: WorkflowTaskSchema }
    ])
  ],
  controllers: [WorkflowsController],
  providers: [WorkflowsService],
  exports: [WorkflowsService]
})
export class WorkflowsModule {}
