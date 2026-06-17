import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShipmentsController } from './controllers/shipments.controller';
import { ShipmentsService } from './services/shipments.service';
import { Shipment, ShipmentSchema } from './schemas/shipment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Shipment.name, schema: ShipmentSchema }])
  ],
  controllers: [ShipmentsController],
  providers: [ShipmentsService],
  exports: [ShipmentsService]
})
export class ShipmentsModule {}
