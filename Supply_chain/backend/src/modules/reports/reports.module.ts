import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportsController } from './controllers/reports.controller';
import { ReportsService } from './services/reports.service';
import { ScheduledReport, ScheduledReportSchema, ReportDownload, ReportDownloadSchema } from './schemas/report.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ScheduledReport.name, schema: ScheduledReportSchema },
      { name: ReportDownload.name, schema: ReportDownloadSchema }
    ])
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService]
})
export class ReportsModule {}
