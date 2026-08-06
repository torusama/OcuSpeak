import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MonitoringRecord } from './entities/monitoring-record.entity';
import { CreateMonitoringRecordDto } from './dto/create-monitoring-record.dto';
import { RealtimeGateway } from '../socket/realtime.gateway';

@Injectable()
export class MonitoringService {
  constructor(
    @InjectRepository(MonitoringRecord)
    private readonly monitoringRepository: Repository<MonitoringRecord>,
    private readonly realtimeGateway: RealtimeGateway,
  ) {}

  async create(dto: CreateMonitoringRecordDto) {
    const record = this.monitoringRepository.create({
      child: { id: dto.childId } as any,
      device: dto.deviceId ? ({ id: dto.deviceId } as any) : undefined,
      type: dto.type,
      metadata: dto.metadata,
    });
    const saved = await this.monitoringRepository.save(record);

    this.realtimeGateway.emitMonitoringUpdate(dto.childId, saved);

    return saved;
  }

  findAllByChild(childId: string, limit = 50) {
    return this.monitoringRepository.find({
      where: { child: { id: childId } },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}
