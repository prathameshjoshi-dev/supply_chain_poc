import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InventoryItemDocument = InventoryItem & Document;

@Schema({ timestamps: true })
export class InventoryItem extends Document {
  @Prop({ required: true, unique: true })
  sku: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  warehouse: string;

  @Prop({ required: true, default: 0 })
  currentQty: number;

  @Prop({ required: true, default: 0 })
  safetyStock: number;

  @Prop({ required: true, enum: ['In Stock', 'Low Stock', 'Stockout'] })
  status: string;

  @Prop({ required: true, default: 0 })
  leadTime: number;

  @Prop({ required: true, default: 0 })
  reorderPoint: number;

  @Prop({ type: [Number], default: [] })
  demandForecast: number[];
}

export const InventoryItemSchema = SchemaFactory.createForClass(InventoryItem);
