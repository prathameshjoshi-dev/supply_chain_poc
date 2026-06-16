import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { BulkActionDto } from '../dto/bulk-action.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/v1/users')
// Temporarily omitting @UseGuards(AuthGuard('jwt')) so you can test easily without tokens.
// Uncomment to protect.
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.usersService.findAll(query);
  }

  @Get('insights')
  getInsights() {
    return this.usersService.getInsights();
  }

  @Post('bulk-action')
  bulkAction(@Body() bulkActionDto: BulkActionDto) {
    return this.usersService.bulkAction(bulkActionDto.userIds, bulkActionDto.action);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
