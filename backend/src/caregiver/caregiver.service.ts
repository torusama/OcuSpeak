import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Caregiver } from './entities/caregiver.entity';
import { CreateCaregiverDto } from './dto/create-caregiver.dto';
import { UpdateCaregiverDto } from './dto/update-caregiver.dto';

@Injectable()
export class CaregiverService {
  constructor(
    @InjectRepository(Caregiver)
    private caregiverRepository: Repository<Caregiver>,
  ) {}

  create(dto: CreateCaregiverDto) {
    const caregiver = this.caregiverRepository.create(dto);
    return this.caregiverRepository.save(caregiver);
  }

  findAll() {
    return this.caregiverRepository.find();
  }

  findOne(id: string) {
    return this.caregiverRepository.findOneBy({ id });
  }

  async update(id: string, dto: UpdateCaregiverDto) {
    await this.caregiverRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.caregiverRepository.delete(id);
    return {
      message: 'Caregiver deleted successfully',
    };
  }
}