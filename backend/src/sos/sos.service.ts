import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SosAlert, SosStatus } from './entities/sos-alert.entity';
import { CreateSosAlertDto } from './dto/create-sos-alert.dto';
import { UpdateSosAlertDto } from './dto/update-sos-alert.dto';
import { RealtimeGateway } from '../socket/realtime.gateway';
import { FirebaseService } from '../firebase/firebase.service';
import { ChildProfile } from '../child/entities/child.entity';

@Injectable()
export class SosService {
  constructor(
    @InjectRepository(SosAlert)
    private readonly sosRepository: Repository<SosAlert>,
    @InjectRepository(ChildProfile)
    private readonly childRepository: Repository<ChildProfile>,
    private readonly realtimeGateway: RealtimeGateway,
    private readonly firebaseService: FirebaseService,
  ) {}

  /** Highest priority path: Patient Web triggers an SOS button. */
  async create(dto: CreateSosAlertDto) {
    const child = await this.childRepository.findOne({
      where: { id: dto.childId },
      relations: ['caregiver'],
    });
    if (!child) {
      throw new NotFoundException('Không tìm thấy hồ sơ trẻ');
    }

    const alert = this.sosRepository.create({
      child,
      device: dto.deviceId ? ({ id: dto.deviceId } as any) : undefined,
      note: dto.note,
      status: SosStatus.ACTIVE,
    });
    const saved = await this.sosRepository.save(alert);

    this.realtimeGateway.emitSosAlert(child.id, saved);

    if (child.caregiver?.fcmToken) {
      await this.firebaseService.sendPushNotification(
        child.caregiver.fcmToken,
        { title: `🚨 SOS từ ${child.fullName}`, body: dto.note ?? 'Trẻ cần trợ giúp ngay' },
        { childId: child.id, alertId: saved.id, priority: 'high' },
      );
    }

    return saved;
  }

  findAllByChild(childId: string) {
    return this.sosRepository.find({
      where: { child: { id: childId } },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const alert = await this.sosRepository.findOne({ where: { id }, relations: ['child'] });
    if (!alert) {
      throw new NotFoundException('Không tìm thấy SOS alert');
    }
    return alert;
  }

  async updateStatus(id: string, dto: UpdateSosAlertDto) {
    const alert = await this.findOne(id);
    alert.status = dto.status;
    if (dto.status === SosStatus.ACKNOWLEDGED) alert.acknowledgedAt = new Date();
    if (dto.status === SosStatus.RESOLVED) alert.resolvedAt = new Date();

    const saved = await this.sosRepository.save(alert);
    this.realtimeGateway.emitSosUpdate(alert.child.id, saved);
    return saved;
  }
}
