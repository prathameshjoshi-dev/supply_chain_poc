import { Controller, Get, Post, Param, Query } from '@nestjs/common';
import { InventoryService } from '../services/inventory.service';
import { GetInventoryDto } from '../dto/get-inventory.dto';

@Controller('api/v1/inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
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
  async getKpis() {
    const data = await this.inventoryService.getKpis();
    return {
      success: true,
      data
    };
  }

  @Post(':sku/restock')
  async initiateRestock(@Param('sku') sku: string) {
    const result = await this.inventoryService.initiateRestock(sku);
    return {
      success: true,
      data: result
    };
  }
}
