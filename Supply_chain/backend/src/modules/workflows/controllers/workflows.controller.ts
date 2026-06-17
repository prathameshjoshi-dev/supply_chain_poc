import { Controller, Get, Post, Patch, Param, Query, Body, ValidationPipe } from '@nestjs/common';
import { WorkflowsService } from '../services/workflows.service';
import { CreateWorkflowDto } from '../dto/create-workflow.dto';

@Controller('api/v1/workflows')
export class WorkflowsController {
  constructor(private readonly workflowsService: WorkflowsService) {}

  @Get()
  async getWorkflows(@Query('status') status?: string) {
    const data = await this.workflowsService.getWorkflows(status);
    return {
      success: true,
      data
    };
  }

  @Post()
  async createWorkflow(@Body(new ValidationPipe()) dto: CreateWorkflowDto) {
    const data = await this.workflowsService.createWorkflow(dto);
    return { success: true, data };
  }

  @Post(':taskId/escalate')
  async escalateWorkflow(@Param('taskId') taskId: string) {
    const data = await this.workflowsService.escalateWorkflow(taskId);
    return { success: true, data };
  }

  @Post(':taskId/pause')
  async pauseWorkflow(@Param('taskId') taskId: string) {
    const data = await this.workflowsService.pauseWorkflow(taskId);
    return { success: true, data };
  }

  @Post(':taskId/complete')
  async completeWorkflow(@Param('taskId') taskId: string) {
    const data = await this.workflowsService.completeWorkflow(taskId);
    return { success: true, data };
  }

  @Patch(':taskId/notes')
  async updateNotes(@Param('taskId') taskId: string, @Body('notes') notes: string) {
    const data = await this.workflowsService.updateNotes(taskId, notes);
    return { success: true, data };
  }
}
