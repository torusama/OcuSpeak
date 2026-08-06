import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CommunicationService } from './communication.service';
import { CreateCommunicationEventDto } from './dto/create-communication-event.dto';
import { CreateCaregiverResponseDto } from './dto/create-caregiver-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentCaregiver } from '../common/decorators/current-caregiver.decorator';
import type { AuthCaregiver } from '../common/decorators/current-caregiver.decorator';

@ApiTags('communication')
@Controller('communication')
export class CommunicationController {
  constructor(private readonly communicationService: CommunicationService) {}

  // Called by Patient Web — no caregiver login on that device.
  @Post('events')
  createEvent(@Body() dto: CreateCommunicationEventDto) {
    return this.communicationService.createEvent(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('events')
  findAllByChild(@Query('childId') childId: string) {
    return this.communicationService.findAllByChild(childId);
  }

  @Get('events/:id')
  findOne(@Param('id') id: string) {
    return this.communicationService.findOne(id);
  }

  @Patch('events/:id/read')
  markRead(@Param('id') id: string) {
    return this.communicationService.markRead(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('events/:id/responses')
  respond(
    @Param('id') id: string,
    @Body() dto: CreateCaregiverResponseDto,
    @CurrentCaregiver() caregiver: AuthCaregiver,
  ) {
    return this.communicationService.respond(id, caregiver.id, dto);
  }
}
