import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppNotification, NotificationDocument } from '../schemas/notification.schema';
import { NotificationPreference, NotificationPreferenceDocument } from '../schemas/notification-preference.schema';

@Injectable()
export class NotificationsService implements OnModuleInit {
  constructor(
    @InjectModel(AppNotification.name) private notificationModel: Model<NotificationDocument>,
    @InjectModel(NotificationPreference.name) private preferenceModel: Model<NotificationPreferenceDocument>,
  ) {}

  async onModuleInit() {
    // Seed mock data for realistic presentation if empty
    const count = await this.notificationModel.countDocuments();
    if (count === 0) {
      await this.seedMockData();
    }
  }

  async seedMockData() {
    const mockNotifications = [
      {
        title: 'Critical Shipment Delay: NEX-9022-TX',
        message: 'Severe weather conditions in Port of Rotterdam have halted all outgoing vessels. Priority Level 1 cargo delayed by estimated 48 hours. Immediate rerouting required.',
        severity: 'critical',
        category: 'Shipment',
        entityId: 'NEX-9022-TX',
        read: false,
        actions: [
          { label: 'RE-ROUTE NOW', actionType: 'REROUTE', actionVariant: 'primary' },
          { label: 'VIEW SHIPMENT', actionType: 'VIEW', actionVariant: 'secondary' }
        ],
        timestamp: new Date(Date.now() - 2 * 60000), // 2 mins ago
      },
      {
        title: 'Stockout Alert: SKU-441-B',
        message: 'Inventory at Austin-04 Hub has reached threshold (5 units). Automated replenishment failed due to vendor holiday. Manual override suggested.',
        severity: 'warning',
        category: 'Inventory',
        entityId: 'SKU-441-B',
        read: false,
        actions: [
          { label: 'TRIGGER REPLENISHMENT', actionType: 'REPLENISH', actionVariant: 'primary' },
          { label: 'VENDOR DETAILS', actionType: 'VIEW', actionVariant: 'secondary' }
        ],
        timestamp: new Date(Date.now() - 14 * 60000), // 14 mins ago
      },
      {
        title: 'Workflow Escalation: Approval Required',
        message: 'Freight invoice #INV-8821 exceeds standard variance (12.4%). Senior Operations approval requested for cost center 1004-Global.',
        severity: 'info',
        category: 'Workflow',
        entityId: 'INV-8821',
        read: false,
        actions: [
          { label: 'APPROVE', actionType: 'APPROVE', actionVariant: 'primary' },
          { label: 'REJECT', actionType: 'REJECT', actionVariant: 'danger' },
          { label: 'INVESTIGATE', actionType: 'VIEW', actionVariant: 'secondary' }
        ],
        timestamp: new Date(Date.now() - 45 * 60000), // 45 mins ago
      },
      {
        title: 'Shipment Delivered: NEX-8812-CA',
        message: 'Last-mile delivery completed for 4 containers at Toronto Logistics Center. Proof of delivery uploaded by Driver-92.',
        severity: 'success',
        category: 'Shipment',
        entityId: 'NEX-8812-CA',
        read: true, // Marked as read to show opacity difference
        actions: [
          { label: 'VIEW POD', actionType: 'VIEW', actionVariant: 'primary' }
        ],
        timestamp: new Date(Date.now() - 120 * 60000), // 2 hours ago
      },
      {
        title: 'Unauthorized Access: Warehouse B',
        message: 'Security sensor triggered at East Gate after hours. High-value cargo sector. AI CCTV monitoring activated.',
        severity: 'warning',
        category: 'Security',
        entityId: 'SEC-WH-B',
        read: false,
        actions: [
          { label: 'VIEW LIVE FEED', actionType: 'VIEW', actionVariant: 'primary' },
          { label: 'DISMISS FALSE ALARM', actionType: 'DISMISS', actionVariant: 'secondary' }
        ],
        timestamp: new Date(Date.now() - 180 * 60000), // 3 hours ago
      }
    ];

    await this.notificationModel.insertMany(mockNotifications.map(n => ({...n, createdAt: n.timestamp})));
  }

  async findAll(query: any = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const filter: any = {};
    
    // Dynamic filtering
    if (query.timeRange && query.timeRange !== 'All Time') {
      const date = new Date();
      if (query.timeRange === 'Past 24 Hours') date.setHours(date.getHours() - 24);
      else if (query.timeRange === 'Past 7 Days') date.setDate(date.getDate() - 7);
      else if (query.timeRange === 'Past 30 Days') date.setDate(date.getDate() - 30);
      filter.createdAt = { $gte: date };
    }

    if (query.severity && query.severity !== 'all') {
      filter.severity = query.severity.toLowerCase();
    }
    
    if (query.category && query.category !== 'All Shipment Types') {
      // Simplistic category matching for demo purposes
      filter.category = query.category;
    }

    const skip = (page - 1) * limit;

    const [data, total, stats] = await Promise.all([
      this.notificationModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.notificationModel.countDocuments(filter).exec(),
      this.getStats()
    ]);

    return {
      data,
      total,
      page,
      limit,
      stats
    };
  }

  private async getStats() {
    const [total, critical, warning, info] = await Promise.all([
      this.notificationModel.countDocuments(),
      this.notificationModel.countDocuments({ severity: 'critical' }),
      this.notificationModel.countDocuments({ severity: 'warning' }),
      this.notificationModel.countDocuments({ severity: 'info' })
    ]);
    return { total, critical, warning, info };
  }

  async markAsRead(id: string) {
    return this.notificationModel.findByIdAndUpdate(id, { read: true }, { new: true }).exec();
  }

  async markAllAsRead() {
    const result = await this.notificationModel.updateMany({ read: false }, { read: true }).exec();
    return { updatedCount: result.modifiedCount };
  }

  async getPreferences(userId: string) {
    let pref = await this.preferenceModel.findOne({ userId }).exec();
    if (!pref) {
      // Default preferences if none found
      pref = new this.preferenceModel({ userId, inAppPush: true, emailDigests: false, smsAlerts: false });
      await pref.save();
    }
    return pref;
  }

  async updatePreferences(userId: string, updateData: any) {
    return this.preferenceModel.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true, upsert: true }
    ).exec();
  }

  // Idempotency check logic for creating notifications (KPI NOTIF-07)
  async dispatchNotification(data: Partial<AppNotification>) {
    // Basic idempotency: check if identical notification was sent in last 5 minutes
    const fiveMinsAgo = new Date(Date.now() - 5 * 60000);
    const existing = await this.notificationModel.findOne({
      entityId: data.entityId,
      category: data.category,
      severity: data.severity,
      createdAt: { $gte: fiveMinsAgo }
    }).exec();

    if (existing) {
      return existing; // Already dispatched
    }

    const notification = new this.notificationModel(data);
    return notification.save();
  }
}
