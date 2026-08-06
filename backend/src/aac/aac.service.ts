import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AacItem } from './entities/aac-item.entity';
import { CreateAacItemDto } from './dto/create-aac-item.dto';
import { UpdateAacItemDto } from './dto/update-aac-item.dto';

@Injectable()
export class AacService {
  constructor(
    @InjectRepository(AacItem)
    private readonly aacItemRepository: Repository<AacItem>,
  ) {}

  create(dto: CreateAacItemDto) {
    const item = this.aacItemRepository.create({
      ...dto,
      child: { id: dto.childId } as any,
    });
    return this.aacItemRepository.save(item);
  }

  findAllByChild(childId: string) {
    return this.aacItemRepository.find({
      where: { child: { id: childId }, isActive: true },
      order: { sortOrder: 'ASC' },
    });
  }

  async findOne(id: string) {
    const item = await this.aacItemRepository.findOneBy({ id });
    if (!item) {
      throw new NotFoundException('Không tìm thấy AAC item');
    }
    return item;
  }

  async update(id: string, dto: UpdateAacItemDto) {
    await this.findOne(id);
    await this.aacItemRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.aacItemRepository.update(id, { isActive: false });
    return { message: 'Đã ẩn AAC item' };
  }
}
