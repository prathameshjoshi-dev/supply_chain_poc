import { Controller, Get, Query } from '@nestjs/common';
import { AuditLogsService } from '../services/audit-logs.service';

@Controller('api/v1/audit-logs')
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get()
  findAll(@Query() query: any) {
    return this.auditLogsService.findAll(query);
  }
}
