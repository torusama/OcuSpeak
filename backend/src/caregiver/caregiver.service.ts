import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Caregiver } from './entities/caregiver.entity';
import { CreateCaregiverDto } from './dto/create-caregiver.dto';
import { UpdateCaregiverDto } from './dto/update-caregiver.dto';

@Injectable()
export class CaregiverService {
  constructor(
    @InjectRepository(Caregiver)
    private caregiverRepository: Repository<Caregiver>,
  ) {}

  async create(dto: CreateCaregiverDto) {
    const existing = await this.caregiverRepository.findOneBy({ email: dto.email });
    if (existing) {
      throw new ConflictException('Email đã được sử dụng');
    }
    const password = await bcrypt.hash(dto.password, 10);
    const caregiver = this.caregiverRepository.create({ ...dto, password });
    const saved = await this.caregiverRepository.save(caregiver);
    return this.findOne(saved.id);
  }

  findAll() {
    return this.caregiverRepository.find();
  }

  async findOne(id: string) {
    const caregiver = await this.caregiverRepository.findOne({
      where: { id },
      relations: ['children'],
    });
    if (!caregiver) {
      throw new NotFoundException('Không tìm thấy caregiver');
    }
    return caregiver;
  }

  async update(id: string, dto: UpdateCaregiverDto) {
    await this.findOne(id);
    const payload: Partial<Caregiver> = { ...dto };
    if (dto.password) {
      payload.password = await bcrypt.hash(dto.password, 10);
    }
    await this.caregiverRepository.update(id, payload);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.caregiverRepository.delete(id);
    return {
      message: 'Caregiver deleted successfully',
    };
  }
}
