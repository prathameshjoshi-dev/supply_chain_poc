import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ShipmentDocument = Shipment & Document;

@Schema({ timestamps: true })
export class Shipment extends Document {
  @Prop({ required: true, unique: true })
  shipmentId: string;

  @Prop({ required: true, enum: ['In-Transit', 'Delayed', 'Delivered', 'Critical'] })
  status: string;

  @Prop({ required: true })
  eta: Date;

  @Prop({ required: true })
  origin: string;

  @Prop({ required: true })
  destination: string;

  @Prop({ required: true })
  carrier: string;

  @Prop({ required: true })
  lastUpdate: Date;

  @Prop({ required: false })
  priority?: string;

  @Prop({ required: false })
  type?: string;

  @Prop({ required: false })
  serviceLevel?: string;

  @Prop({ required: false })
  weight?: number;

  @Prop({ required: false })
  quantity?: number;

  @Prop({ required: false })
  packagingType?: string;

  @Prop({ type: Object, required: false })
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };

  @Prop({ required: false })
  description?: string;
}

export const ShipmentSchema = SchemaFactory.createForClass(Shipment);

// Indexes for common queries
ShipmentSchema.index({ shipmentId: 1 });
ShipmentSchema.index({ status: 1 });
ShipmentSchema.index({ carrier: 1 });
ShipmentSchema.index({ eta: -1 });
