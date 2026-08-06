import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { MonitoringService } from './monitoring.service';
import { CreateMonitoringRecordDto } from './dto/create-monitoring-record.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('monitoring')
@Controller('monitoring')
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringService) {}

  // Called by Patient Web devices to report heartbeat/battery/calibration events.
  @Post('records')
  create(@Body() dto: CreateMonitoringRecordDto) {
    return this.monitoringService.create(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('records')
  findAllByChild(@Query('childId') childId: string) {
    return this.monitoringService.findAllByChild(childId);
  }
}
