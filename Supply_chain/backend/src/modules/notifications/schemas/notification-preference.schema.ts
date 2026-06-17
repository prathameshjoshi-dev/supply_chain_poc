import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotificationPreferenceDocument = NotificationPreference & Document;

@Schema({ timestamps: true, collection: 'notification_preferences' })
export class NotificationPreference {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({ default: true })
  inAppPush: boolean;

  @Prop({ default: false })
  emailDigests: boolean;

  @Prop({ default: false })
  smsAlerts: boolean;
}

export const NotificationPreferenceSchema = SchemaFactory.createForClass(NotificationPreference);
