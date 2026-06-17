import { Controller, Get, Patch, Param, Body, Query, Put } from '@nestjs/common';
import { NotificationsService } from '../services/notifications.service';

@Controller('api/v1/notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  findAll(@Query() query: any) {
    return this.notificationsService.findAll(query);
  }

  @Patch('read-all')
  markAllAsRead() {
    return this.notificationsService.markAllAsRead();
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }

  @Get('preferences')
  getPreferences(@Query('userId') userId: string) {
    // In a real app with AuthGuard, userId would come from req.user
    const uid = userId || 'default-user-id';
    return this.notificationsService.getPreferences(uid);
  }

  @Put('preferences')
  updatePreferences(@Body() updateData: any) {
    const uid = updateData.userId || 'default-user-id';
    return this.notificationsService.updatePreferences(uid, updateData);
  }
}
