import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Shipment, ShipmentSchema } from '../shipments/schemas/shipment.schema';
import { InventoryItem, InventoryItemSchema } from '../inventory/schemas/inventory-item.schema';
import { WorkflowTask, WorkflowTaskSchema } from '../workflows/schemas/workflow-task.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Shipment.name, schema: ShipmentSchema },
      { name: InventoryItem.name, schema: InventoryItemSchema },
      { name: WorkflowTask.name, schema: WorkflowTaskSchema },
    ])
  ],
  controllers: [DashboardController],
  providers: [DashboardService]
})
export class DashboardModule {}
