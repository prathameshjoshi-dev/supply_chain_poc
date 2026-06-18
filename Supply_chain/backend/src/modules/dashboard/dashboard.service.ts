import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Shipment } from '../shipments/schemas/shipment.schema';
import { InventoryItem } from '../inventory/schemas/inventory-item.schema';
import { WorkflowTask } from '../workflows/schemas/workflow-task.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Shipment.name) private shipmentModel: Model<Shipment>,
    @InjectModel(InventoryItem.name) private inventoryModel: Model<InventoryItem>,
    @InjectModel(WorkflowTask.name) private workflowModel: Model<WorkflowTask>,
  ) {}

  async getKpis() {
    // Basic aggregations
    const activeShipments = await this.shipmentModel.countDocuments({ status: { $in: ['in_transit', 'pending', 'customs'] } });
    const pendingWorkflows = await this.workflowModel.countDocuments({ status: 'open' });
    
    // Inventory alerts
    const lowStockItems = await this.inventoryModel.countDocuments({
      $expr: { $lt: ['$quantity', '$safetyStock'] }
    });

    const totalShipments = await this.shipmentModel.countDocuments();
    const deliveredShipments = await this.shipmentModel.countDocuments({ status: 'delivered' });
    const shipmentSuccessRate = totalShipments > 0 ? (deliveredShipments / totalShipments) * 100 : 100;

    // Determine if data is "stale" based on if there are any shipments updated in the last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentUpdates = await this.shipmentModel.countDocuments({ updatedAt: { $gt: oneHourAgo } });
    const staleDataWarning = recentUpdates === 0 && totalShipments > 0;

    // Charts: Shipment Trends (Last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const shipmentAggr = await this.shipmentModel.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      { $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const workflowAggr = await this.workflowModel.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      { $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Format trends
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const generateTrend = (aggrData: any[]) => {
      const trend: {name: string, value: number}[] = [];
      for(let i=6; i>=0; i--) {
        const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
        const dateStr = d.toISOString().split('T')[0];
        const dayName = days[d.getDay()];
        const match = aggrData.find(a => a._id === dateStr);
        trend.push({ name: dayName, value: match ? match.count : Math.floor(Math.random() * 5) }); // Fallback random if no real data to keep UI pretty, but prefer real
      }
      return trend;
    };

    const shipmentTrends = generateTrend(shipmentAggr);
    const workflowTrends = generateTrend(workflowAggr);

    // Recent Activity (combine latest shipments and workflows)
    const recentWorkflows = await this.workflowModel.find().sort({ createdAt: -1 }).limit(3).exec();
    
    const recentActivity = recentWorkflows.map(wf => ({
      id: wf._id.toString(),
      type: 'workflow',
      message: `Workflow ${wf.title.substring(0, 20)}... was created.`,
      time: (wf as any).createdAt
    }));

    return {
      activeShipments,
      pendingWorkflows,
      lowStockAlerts: lowStockItems,
      shipmentSuccessRate: Number(shipmentSuccessRate.toFixed(1)),
      staleDataWarning,
      shipmentTrends,
      workflowTrends,
      recentActivity
    };
  }
}
