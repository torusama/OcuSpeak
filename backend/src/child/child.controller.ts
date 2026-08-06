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

import { ChildService } from './child.service';
import { CreateChildDto } from './dto/create-child.dto';
import { UpdateChildDto } from './dto/update-child.dto';
import { UpdateChildConfigDto } from './dto/update-child-config.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('children')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('children')
export class ChildController {
  constructor(private readonly childService: ChildService) {}

  @Post()
  create(@Body() dto: CreateChildDto) {
    return this.childService.create(dto);
  }

  @Get()
  findAll(@Query('caregiverId') caregiverId: string) {
    return this.childService.findAllByCaregiver(caregiverId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.childService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateChildDto) {
    return this.childService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.childService.remove(id);
  }

  @Get(':id/config')
  getConfig(@Param('id') id: string) {
    return this.childService.getConfig(id);
  }

  @Patch(':id/config')
  updateConfig(@Param('id') id: string, @Body() dto: UpdateChildConfigDto) {
    return this.childService.updateConfig(id, dto);
  }
}
