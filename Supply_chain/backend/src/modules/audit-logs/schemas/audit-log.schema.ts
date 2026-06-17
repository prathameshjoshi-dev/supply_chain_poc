import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
class AuditLogUser {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  initials: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  colorClass: string;
}

@Schema({ timestamps: true })
export class AuditLog extends Document {
  @Prop({ required: true, default: Date.now })
  timestamp: Date;

  @Prop({ type: AuditLogUser, required: true })
  user: AuditLogUser;

  @Prop({ required: true, enum: ['CREATE', 'UPDATE', 'DELETE', 'AUTH'] })
  action: string;

  @Prop({ required: true })
  entity: string;

  @Prop({ required: true })
  entityId: string;

  @Prop({ required: true })
  sourceIp: string;

  @Prop({ required: true, enum: ['info', 'success', 'warning', 'critical'], default: 'info' })
  severity: string;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
