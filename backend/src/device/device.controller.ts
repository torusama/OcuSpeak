import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { DeviceService } from './device.service';
import { RegisterDeviceDto } from './dto/register-device.dto';
import { PairDeviceDto } from './dto/pair-device.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('devices')
@Controller('devices')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  register(@Body() dto: RegisterDeviceDto) {
    return this.deviceService.register(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/regenerate-code')
  regenerateCode(@Param('id') id: string) {
    return this.deviceService.regenerateCode(id);
  }

  // Called by Patient Web app itself — no caregiver JWT available on that device.
  @Post('pair')
  pair(@Body() dto: PairDeviceDto) {
    return this.deviceService.pair(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('by-child/:childId')
  findAllByChild(@Param('childId') childId: string) {
    return this.deviceService.findAllByChild(childId);
  }

  @Patch(':id/status')
  setStatus(@Param('id') id: string, @Body('online') online: boolean) {
    return this.deviceService.setOnlineStatus(id, online);
  }
}
