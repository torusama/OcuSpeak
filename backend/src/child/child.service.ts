import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ChildProfile } from './entities/child.entity';
import { ChildConfig } from './entities/child-config.entity';
import { CreateChildDto } from './dto/create-child.dto';
import { UpdateChildDto } from './dto/update-child.dto';
import { UpdateChildConfigDto } from './dto/update-child-config.dto';

@Injectable()
export class ChildService {
  constructor(
    @InjectRepository(ChildProfile)
    private readonly childRepository: Repository<ChildProfile>,
    @InjectRepository(ChildConfig)
    private readonly childConfigRepository: Repository<ChildConfig>,
  ) {}

  async create(dto: CreateChildDto) {
    const child = this.childRepository.create({
      fullName: dto.fullName,
      birthday: new Date(dto.birthday),
      gender: dto.gender,
      diagnosis: dto.diagnosis,
      language: dto.language ?? 'vi',
      avatar: dto.avatar,
      caregiver: { id: dto.caregiverId } as any,
    });
    const saved = await this.childRepository.save(child);

    const config = this.childConfigRepository.create({ child: saved });
    await this.childConfigRepository.save(config);

    return this.findOne(saved.id);
  }

  findAllByCaregiver(caregiverId: string) {
    return this.childRepository.find({
      where: { caregiver: { id: caregiverId } },
      relations: ['config', 'devices'],
    });
  }

  async findOne(id: string) {
    const child = await this.childRepository.findOne({
      where: { id },
      relations: ['config', 'devices', 'caregiver'],
    });
    if (!child) {
      throw new NotFoundException('Không tìm thấy hồ sơ trẻ');
    }
    return child;
  }

  async update(id: string, dto: UpdateChildDto) {
    const child = await this.findOne(id);
    Object.assign(child, {
      ...dto,
      birthday: dto.birthday ? new Date(dto.birthday) : child.birthday,
    });
    await this.childRepository.save(child);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.childRepository.delete(id);
    return { message: 'Đã xoá hồ sơ trẻ' };
  }

  async updateConfig(childId: string, dto: UpdateChildConfigDto) {
    const child = await this.findOne(childId);
    const config = child.config ?? this.childConfigRepository.create({ child });
    Object.assign(config, dto);
    await this.childConfigRepository.save(config);
    return this.findOne(childId);
  }

  async getConfig(childId: string) {
    const child = await this.findOne(childId);
    return child.config;
  }
}
