import { Controller, Get, Post, Query, Body, UseGuards } from '@nestjs/common';
import { ShipmentsService } from '../services/shipments.service';
import { GetShipmentsDto } from '../dto/get-shipments.dto';
import { CreateShipmentDto } from '../dto/create-shipment.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';

@Controller('api/v1/shipments')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ShipmentsController {
  constructor(private readonly shipmentsService: ShipmentsService) {}

  @Get()
  @Roles('admin', 'manager', 'supervisor', 'viewer')
  async getShipments(@Query() query: GetShipmentsDto) {
    const result = await this.shipmentsService.getShipments(query);
    return {
      success: true,
      data: result.data,
      meta: {
        total: result.total,
        page: Number(result.page),
        limit: Number(result.limit),
        totalPages: result.totalPages
      }
    };
  }

  @Post()
  @Roles('admin', 'manager', 'supervisor')
  async createShipment(@Body() dto: CreateShipmentDto) {
    const result = await this.shipmentsService.createShipment(dto);
    return {
      success: true,
      data: result
    };
  }
}
