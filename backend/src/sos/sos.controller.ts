import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { SosService } from './sos.service';
import { CreateSosAlertDto } from './dto/create-sos-alert.dto';
import { UpdateSosAlertDto } from './dto/update-sos-alert.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('sos')
@Controller('sos')
export class SosController {
  constructor(private readonly sosService: SosService) {}

  // Called by Patient Web — no caregiver login on that device.
  @Post('alerts')
  create(@Body() dto: CreateSosAlertDto) {
    return this.sosService.create(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('alerts')
  findAllByChild(@Query('childId') childId: string) {
    return this.sosService.findAllByChild(childId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('alerts/:id')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateSosAlertDto) {
    return this.sosService.updateStatus(id, dto);
  }
}
