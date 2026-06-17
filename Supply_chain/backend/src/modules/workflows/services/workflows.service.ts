import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WorkflowTask, WorkflowTaskDocument } from '../schemas/workflow-task.schema';
import { CreateWorkflowDto } from '../dto/create-workflow.dto';

@Injectable()
export class WorkflowsService implements OnModuleInit {
  constructor(@InjectModel(WorkflowTask.name) private workflowModel: Model<WorkflowTaskDocument>) {}

  async onModuleInit() {
    await this.generateSeedData();
  }

  private async generateSeedData() {
    const count = await this.workflowModel.countDocuments();
    if (count === 0) {
      const mockData = [
        {
          taskId: 'NX-9042',
          priority: 'Critical Priority',
          title: 'Cross-Docking Replenishment Blocked',
          dueAt: new Date(new Date().setHours(14, 0, 0, 0)),
          category: 'Replenishment',
          assignees: ['S. Kowalski', 'J. Doe'],
          status: 'Open',
          summary: 'Bulk replenishment for Zone 4 (Pharma) is stalled due to a sensor failure on automated conveyor unit C-12. Priority items delayed: Insulin Batch 042-X.',
          progress: 15,
          auditTrail: [
            { timestamp: new Date(new Date().setHours(10, 45, 0, 0)), user: 'System', message: 'Critical alarm triggered. Workflow auto-generated.', isCritical: true },
            { timestamp: new Date(new Date().setHours(11, 2, 0, 0)), user: 'S. Kowalski', message: 'Assigned task. Initiating remote sensor diagnostic.', isCritical: false }
          ],
          notes: ''
        },
        {
          taskId: 'NX-8831',
          priority: 'High Priority',
          title: 'Customs Approval Pending (Rotterdam)',
          dueAt: new Date(new Date(Date.now() + 86400000).setHours(9, 30, 0, 0)),
          category: 'Approval',
          assignees: ['M. Chen'],
          status: 'Open',
          summary: 'Pending clearance for container XZ-88. Needs secondary documentation review.',
          progress: 40,
          auditTrail: [
            { timestamp: new Date(), user: 'System', message: 'Approval requested.', isCritical: false }
          ],
          notes: ''
        },
        {
          taskId: 'NX-7215',
          priority: 'Standard',
          title: 'Route Optimization Audit',
          dueAt: new Date(new Date(Date.now() + 2 * 86400000).setHours(17, 0, 0, 0)),
          category: 'Optimization',
          assignees: ['J. Smith'],
          status: 'In-Progress',
          summary: 'Monthly review of route inefficiencies in the EU sector.',
          progress: 75,
          auditTrail: [
            { timestamp: new Date(), user: 'J. Smith', message: 'Started audit process.', isCritical: false }
          ],
          notes: 'Initial findings show 5% delay in sector 4.'
        }
      ];
      await this.workflowModel.insertMany(mockData);
      console.log('Workflows mock data seeded.');
    }
  }

  async getWorkflows(status?: string) {
    const query = status ? { status } : {};
    // Ensure Open tasks are sorted by priority (Critical first, then High, then Standard)
    return this.workflowModel.find(query).sort({ dueAt: 1 }).exec();
  }

  async createWorkflow(dto: CreateWorkflowDto, user: string = 'Current User') {
    // Map priority
    let priorityStr = 'Standard';
    if (dto.priority === 'Critical') priorityStr = 'Critical Priority';
    if (dto.priority === 'High') priorityStr = 'High Priority';

    // Generate Task ID
    const randomId = Math.floor(1000 + Math.random() * 9000);
    const taskId = `NX-${randomId}`;

    // Generate Title
    const title = dto.relatedEntityId ? `${dto.category} - ${dto.relatedEntityId}` : `${dto.category} Task`;

    const newTask = new this.workflowModel({
      taskId,
      priority: priorityStr,
      title,
      dueAt: new Date(dto.dueAt),
      category: dto.category,
      assignees: dto.assignee ? [dto.assignee] : [],
      relatedEntityId: dto.relatedEntityId,
      status: 'Open',
      summary: dto.notes || 'Task manually created by operator.',
      progress: 0,
      auditTrail: [
        {
          timestamp: new Date(),
          user,
          message: 'Task manually created.',
          isCritical: priorityStr === 'Critical Priority'
        }
      ],
      notes: ''
    });

    return newTask.save();
  }

  async escalateWorkflow(taskId: string) {
    const task = await this.workflowModel.findOne({ taskId }).exec();
    if (!task) throw new NotFoundException('Task not found');
    task.status = 'Escalated';
    task.auditTrail.push({
      timestamp: new Date(),
      user: 'Current User',
      message: 'Task escalated to supervisor.',
      isCritical: true
    });
    return task.save();
  }

  async pauseWorkflow(taskId: string) {
    const task = await this.workflowModel.findOne({ taskId }).exec();
    if (!task) throw new NotFoundException('Task not found');
    task.status = 'In-Progress'; // Using In-Progress as paused/active state
    task.auditTrail.push({
      timestamp: new Date(),
      user: 'Current User',
      message: 'Task execution paused/updated.',
      isCritical: false
    });
    return task.save();
  }

  async completeWorkflow(taskId: string) {
    const task = await this.workflowModel.findOne({ taskId }).exec();
    if (!task) throw new NotFoundException('Task not found');
    task.status = 'Resolved';
    task.progress = 100;
    task.auditTrail.push({
      timestamp: new Date(),
      user: 'Current User',
      message: 'Task resolved successfully.',
      isCritical: false
    });
    return task.save();
  }

  async updateNotes(taskId: string, notes: string) {
    const task = await this.workflowModel.findOne({ taskId }).exec();
    if (!task) throw new NotFoundException('Task not found');
    task.notes = notes;
    return task.save();
  }
}
