import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WorkflowTaskDocument = WorkflowTask & Document;

@Schema({ _id: false })
class AuditTrailEntry {
  @Prop({ required: true })
  timestamp: Date;

  @Prop({ required: true })
  user: string;

  @Prop({ required: true })
  message: string;

  @Prop({ default: false })
  isCritical: boolean;
}
const AuditTrailEntrySchema = SchemaFactory.createForClass(AuditTrailEntry);

@Schema({ timestamps: true })
export class WorkflowTask extends Document {
  @Prop({ required: true, unique: true })
  taskId: string;

  @Prop({ required: true, enum: ['Critical Priority', 'High Priority', 'Standard'] })
  priority: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  relatedEntityId: string;

  @Prop({ required: true })
  dueAt: Date;

  @Prop({ required: true })
  category: string;

  @Prop({ type: [String], default: [] })
  assignees: string[];

  @Prop({ required: true, enum: ['Open', 'In-Progress', 'Resolved', 'Escalated'] })
  status: string;

  @Prop({ required: true })
  summary: string;

  @Prop({ required: true, default: 0 })
  progress: number;

  @Prop({ type: [AuditTrailEntrySchema], default: [] })
  auditTrail: AuditTrailEntry[];

  @Prop({ default: '' })
  notes: string;
}

export const WorkflowTaskSchema = SchemaFactory.createForClass(WorkflowTask);
