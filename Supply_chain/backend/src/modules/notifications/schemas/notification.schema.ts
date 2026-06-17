import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type NotificationDocument = AppNotification & Document;

@Schema({ _id: false })
class NotificationAction {
  @Prop({ required: true })
  label: string;

  @Prop({ required: true })
  actionType: string;

  @Prop({ required: true })
  actionVariant: string;

  @Prop({ type: MongooseSchema.Types.Mixed })
  payload: any;
}

const NotificationActionSchema = SchemaFactory.createForClass(NotificationAction);

@Schema({ timestamps: true, collection: 'notifications' })
export class AppNotification {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true, enum: ['critical', 'warning', 'info', 'success'] })
  severity: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  entityId: string;

  @Prop({ default: false })
  read: boolean;

  @Prop({ default: 'delivered', enum: ['pending', 'delivered', 'failed'] })
  deliveryStatus: string;

  @Prop({ type: [NotificationActionSchema], default: [] })
  actions: NotificationAction[];

  @Prop()
  userId?: string;
  
  @Prop({ default: 0 })
  retryCount: number;
}

export const NotificationSchema = SchemaFactory.createForClass(AppNotification);
