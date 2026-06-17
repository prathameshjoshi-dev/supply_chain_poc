import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class AiHistory extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ required: true })
  prompt: string;

  @Prop({ required: true })
  response: string;
}

export const AiHistorySchema = SchemaFactory.createForClass(AiHistory);
