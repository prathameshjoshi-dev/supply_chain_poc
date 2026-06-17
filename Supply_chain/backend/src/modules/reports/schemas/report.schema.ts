import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ScheduledReportDocument = ScheduledReport & Document;
export type ReportDownloadDocument = ReportDownload & Document;

@Schema({ timestamps: true })
export class ScheduledReport extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  frequency: string;

  @Prop({ required: true })
  nextRun: string;

  @Prop({ type: [String], default: [] })
  recipients: string[];

  @Prop({ required: true, enum: ['Active', 'Paused'] })
  status: string;
}

@Schema({ timestamps: true })
export class ReportDownload extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  generatedAt: Date;

  @Prop({ required: true })
  size: string;
}

export const ScheduledReportSchema = SchemaFactory.createForClass(ScheduledReport);
export const ReportDownloadSchema = SchemaFactory.createForClass(ReportDownload);
