import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AacService } from './aac.service';
import { CreateAacItemDto } from './dto/create-aac-item.dto';
import { UpdateAacItemDto } from './dto/update-aac-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('aac')
@Controller('aac')
export class AacController {
  constructor(private readonly aacService: AacService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateAacItemDto) {
    return this.aacService.create(dto);
  }

  // Read is shared by Patient Web (no login) and Caregiver App.
  @Get()
  findAllByChild(@Query('childId') childId: string) {
    return this.aacService.findAllByChild(childId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aacService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAacItemDto) {
    return this.aacService.update(id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.aacService.remove(id);
  }
}
