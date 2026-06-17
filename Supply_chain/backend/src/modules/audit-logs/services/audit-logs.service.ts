import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog } from '../schemas/audit-log.schema';

@Injectable()
export class AuditLogsService implements OnModuleInit {
  constructor(@InjectModel(AuditLog.name) private auditLogModel: Model<AuditLog>) {}

  async onModuleInit() {
    await this.seedMockLogs();
  }

  private async seedMockLogs() {
    const count = await this.auditLogModel.countDocuments();
    if (count > 0) return; // Only seed if empty

    const mockLogs = [
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
        user: { id: 'u1', initials: 'AC', name: 'Alex Chen', colorClass: 'bg-primary-container/20 text-primary' },
        action: 'CREATE',
        entity: 'Shipment',
        entityId: '#SH-9921-X',
        sourceIp: '192.168.1.104',
        severity: 'success'
      },
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
        user: { id: 'u2', initials: 'SJ', name: 'Sarah Jenkins', colorClass: 'bg-secondary-container/20 text-secondary' },
        action: 'UPDATE',
        entity: 'Inventory',
        entityId: 'SKU-BR-402',
        sourceIp: '10.0.0.45',
        severity: 'info'
      },
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 45),
        user: { id: 'u3', initials: 'SA', name: 'System Admin', colorClass: 'bg-status-critical/10 text-status-critical' },
        action: 'DELETE',
        entity: 'User Access',
        entityId: 'U-9021 (Guest)',
        sourceIp: 'localhost:8080',
        severity: 'critical'
      },
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        user: { id: 'u4', initials: 'MK', name: 'Marcus Kovic', colorClass: 'bg-status-warning/10 text-status-warning' },
        action: 'AUTH',
        entity: 'Login Session',
        entityId: 'WEB-MOBILE-OS',
        sourceIp: '72.14.213.99',
        severity: 'warning'
      },
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 120),
        user: { id: 'u1', initials: 'AC', name: 'Alex Chen', colorClass: 'bg-primary-container/20 text-primary' },
        action: 'UPDATE',
        entity: 'Workflow',
        entityId: 'WF-TRANS-EU',
        sourceIp: '192.168.1.104',
        severity: 'info'
      },
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 140),
        user: { id: 'u2', initials: 'SJ', name: 'Sarah Jenkins', colorClass: 'bg-secondary-container/20 text-secondary' },
        action: 'CREATE',
        entity: 'Report',
        entityId: 'Q4-PROJ-FIN',
        sourceIp: '10.0.0.45',
        severity: 'success'
      }
    ];

    await this.auditLogModel.insertMany(mockLogs);
  }

  async logEvent(data: {
    action: string;
    entity: string;
    entityId: string;
    sourceIp?: string;
    severity?: string;
    user?: any;
  }) {
    const defaultUser = { id: 'system', initials: 'SA', name: 'System Admin', colorClass: 'bg-primary-container/20 text-primary' };
    
    const newLog = new this.auditLogModel({
      timestamp: new Date(),
      user: data.user || defaultUser,
      action: data.action,
      entity: data.entity,
      entityId: data.entityId,
      sourceIp: data.sourceIp || '127.0.0.1',
      severity: data.severity || 'info'
    });
    
    await newLog.save();
  }

  async findAll(query: any = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (query.user && query.user !== 'All Users') {
      filter['user.name'] = new RegExp(query.user, 'i');
    }
    if (query.action && query.action !== 'All Actions') {
      filter.action = query.action;
    }
    if (query.entity && query.entity !== 'All Entities') {
      filter.entity = new RegExp(query.entity, 'i');
    }
    // Simplistic date filtering
    if (query.dateRange === 'Last 24 Hours') {
      filter.timestamp = { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) };
    } else if (query.dateRange === 'Last 7 Days') {
      filter.timestamp = { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) };
    } else if (query.dateRange === 'Last 30 Days') {
      filter.timestamp = { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) };
    }

    const [data, total] = await Promise.all([
      this.auditLogModel.find(filter).sort({ timestamp: -1 }).skip(skip).limit(limit).exec(),
      this.auditLogModel.countDocuments(filter).exec(),
    ]);

    // Provide real KPIs based on database data
    const stats = {
      totalEvents: total,
      criticalActions: await this.auditLogModel.countDocuments({ ...filter, severity: 'critical' }),
      authFailures: await this.auditLogModel.countDocuments({ ...filter, action: 'AUTH', severity: 'warning' }),
      uptime: '99.98%'
    };

    return {
      data,
      total,
      page,
      limit,
      stats,
    };
  }
}
