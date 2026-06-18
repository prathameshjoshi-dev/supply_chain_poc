import { Controller, Get, Post, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InventoryService } from '../services/inventory.service';
import { GetInventoryDto } from '../dto/get-inventory.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('api/v1/inventory')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) { }

  @Get()
  @Roles('admin', 'manager', 'supervisor', 'viewer')
  async getInventory(@Query() query: GetInventoryDto) {
    const result = await this.inventoryService.getInventory(query);
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

  @Get('kpis')
  @Roles('admin', 'manager', 'supervisor', 'viewer')
  async getKpis() {
    const data = await this.inventoryService.getKpis();
    return {
      success: true,
      data
    };
  }

  @Post(':sku/restock')
  @Roles('admin', 'manager', 'supervisor')
  async initiateRestock(@Param('sku') sku: string) {
    const result = await this.inventoryService.initiateRestock(sku);
    return {
      success: true,
      data: result
    };
  }
}
