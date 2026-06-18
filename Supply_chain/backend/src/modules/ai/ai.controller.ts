import { Controller, Post, Body, HttpCode, HttpStatus, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AiService } from './ai.service';

class ChatDto {
  userId: string;
  message: string;
}

@Controller('api/v1/ai')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  @HttpCode(HttpStatus.OK)
  async chat(@Body() chatDto: ChatDto) {
    const response = await this.aiService.sendMessage(chatDto.userId, chatDto.message);
    return {
      status: 'success',
      data: {
        response,
      },
    };
  }

  @Get('history')
  async getHistory(@Query('userId') userId: string) {
    if (!userId) {
      return { status: 'success', data: [] };
    }
    const history = await this.aiService.getHistory(userId);
    return {
      status: 'success',
      data: history,
    };
  }
}
