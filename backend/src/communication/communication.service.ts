import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CommunicationEvent, CommunicationStatus } from './entities/communication-event.entity';
import { CaregiverResponse } from './entities/caregiver-response.entity';
import { CreateCommunicationEventDto } from './dto/create-communication-event.dto';
import { CreateCaregiverResponseDto } from './dto/create-caregiver-response.dto';
import { RealtimeGateway } from '../socket/realtime.gateway';
import { FirebaseService } from '../firebase/firebase.service';
import { ChildProfile } from '../child/entities/child.entity';

@Injectable()
export class CommunicationService {
  constructor(
    @InjectRepository(CommunicationEvent)
    private readonly eventRepository: Repository<CommunicationEvent>,
    @InjectRepository(CaregiverResponse)
    private readonly responseRepository: Repository<CaregiverResponse>,
    @InjectRepository(ChildProfile)
    private readonly childRepository: Repository<ChildProfile>,
    private readonly realtimeGateway: RealtimeGateway,
    private readonly firebaseService: FirebaseService,
  ) {}

  /** Patient Web sends an AAC-composed message. */
  async createEvent(dto: CreateCommunicationEventDto) {
    const child = await this.childRepository.findOne({
      where: { id: dto.childId },
      relations: ['caregiver'],
    });
    if (!child) {
      throw new NotFoundException('Không tìm thấy hồ sơ trẻ');
    }

    const event = this.eventRepository.create({
      child,
      itemIds: dto.itemIds,
      sentence: dto.sentence,
      status: CommunicationStatus.SENT,
      unread: true,
    });
    const saved = await this.eventRepository.save(event);

    this.realtimeGateway.emitCommunicationEvent(child.id, saved);

    if (child.caregiver?.fcmToken) {
      await this.firebaseService.sendPushNotification(
        child.caregiver.fcmToken,
        { title: `${child.fullName} vừa gửi tin nhắn`, body: dto.sentence },
        { childId: child.id, eventId: saved.id },
      );
    }

    return saved;
  }

  findAllByChild(childId: string) {
    return this.eventRepository.find({
      where: { child: { id: childId } },
      relations: ['responses'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['child', 'responses'],
    });
    if (!event) {
      throw new NotFoundException('Không tìm thấy communication event');
    }
    return event;
  }

  async markRead(id: string) {
    await this.findOne(id);
    await this.eventRepository.update(id, { unread: false, status: CommunicationStatus.READ });
    return this.findOne(id);
  }

  /** Caregiver App replies to a message. */
  async respond(eventId: string, caregiverId: string, dto: CreateCaregiverResponseDto) {
    const event = await this.findOne(eventId);

    const response = this.responseRepository.create({
      event,
      caregiver: { id: caregiverId } as any,
      type: dto.type,
      content: dto.content,
    });
    const saved = await this.responseRepository.save(response);

    await this.eventRepository.update(eventId, { status: CommunicationStatus.RESPONDED });

    this.realtimeGateway.emitCaregiverResponse(event.child.id, saved);

    return saved;
  }
}
