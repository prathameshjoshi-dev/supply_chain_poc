import { Controller, Get, Post, Body, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { ReportsService } from '../services/reports.service';

@Controller('api/v1/reports')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('admin', 'manager')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('scheduled')
  async getScheduledReports() {
    const data = await this.reportsService.getScheduledReports();
    return { success: true, data };
  }

  @Get('downloads')
  async getRecentDownloads() {
    const data = await this.reportsService.getRecentDownloads();
    return { success: true, data };
  }

  @Post('generate')
  async generateReport(@Body() payload: any) {
    const data = await this.reportsService.generateReport(payload);
    return { success: true, data };
  }

  @Delete('downloads')
  async clearRecentDownloads() {
    await this.reportsService.clearRecentDownloads();
    return { success: true };
  }
}
