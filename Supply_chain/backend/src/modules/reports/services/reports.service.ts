import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ScheduledReport, ScheduledReportDocument, ReportDownload, ReportDownloadDocument } from '../schemas/report.schema';

@Injectable()
export class ReportsService implements OnModuleInit {
  constructor(
    @InjectModel(ScheduledReport.name) private scheduledReportModel: Model<ScheduledReportDocument>,
    @InjectModel(ReportDownload.name) private reportDownloadModel: Model<ReportDownloadDocument>
  ) {}

  async onModuleInit() {
    await this.generateSeedData();
  }

  private async generateSeedData() {
    const scheduledCount = await this.scheduledReportModel.countDocuments();
    if (scheduledCount === 0) {
      const scheduledData = [
        {
          name: 'Weekly Logistics Performance',
          frequency: 'Every Monday, 04:00 UTC',
          nextRun: 'In 2 days',
          recipients: ['JD', '+3'],
          status: 'Active'
        },
        {
          name: 'Inventory Low-Stock Alert',
          frequency: 'Daily, 00:00 UTC',
          nextRun: 'In 4 hours',
          recipients: ['AR'],
          status: 'Active'
        },
        {
          name: 'Monthly Compliance Audit',
          frequency: '1st of Month',
          nextRun: 'Oct 01',
          recipients: ['LM'],
          status: 'Paused'
        }
      ];
      await this.scheduledReportModel.insertMany(scheduledData);
    }

    const downloadCount = await this.reportDownloadModel.countDocuments();
    if (downloadCount === 0) {
      const downloadData = [
        {
          name: 'Q3_North_America_Logistics.pdf',
          type: 'pdf',
          generatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          size: '4.2 MB'
        },
        {
          name: 'Audit_Log_Master_Export_V2.csv',
          type: 'csv',
          generatedAt: new Date(new Date().setHours(8, 30, 0, 0)), // Today 08:30
          size: '12.8 MB'
        }
      ];
      await this.reportDownloadModel.insertMany(downloadData);
    }
    console.log('Reports mock data seeded.');
  }

  async getScheduledReports() {
    return this.scheduledReportModel.find().exec();
  }

  async getRecentDownloads() {
    return this.reportDownloadModel.find().sort({ generatedAt: -1 }).exec();
  }

  async generateReport(payload: any) {
    // In a real scenario, this would trigger a background job to generate the report.
    // We just simulate success and add it to recent downloads.
    const newDownload = new this.reportDownloadModel({
      name: `Custom_Report_${Date.now()}.${payload.format || 'pdf'}`,
      type: payload.format || 'pdf',
      generatedAt: new Date(),
      size: '1.5 MB'
    });
    return newDownload.save();
  }

  async clearRecentDownloads() {
    return this.reportDownloadModel.deleteMany({});
  }
}
