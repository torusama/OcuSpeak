import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CaregiverService } from './caregiver.service';
import { CreateCaregiverDto } from './dto/create-caregiver.dto';
import { UpdateCaregiverDto } from './dto/update-caregiver.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('caregivers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('caregivers')
export class CaregiverController {
  constructor(private readonly caregiverService: CaregiverService) {}

  @Post()
  create(@Body() dto: CreateCaregiverDto) {
    return this.caregiverService.create(dto);
  }

  @Get()
  findAll() {
    return this.caregiverService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.caregiverService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCaregiverDto) {
    return this.caregiverService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.caregiverService.remove(id);
  }
}
