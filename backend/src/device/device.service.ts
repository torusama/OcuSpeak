import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Device } from './entities/device.entity';
import { ChildProfile } from '../child/entities/child.entity';
import { RegisterDeviceDto } from './dto/register-device.dto';
import { PairDeviceDto } from './dto/pair-device.dto';
import { RealtimeGateway } from '../socket/realtime.gateway';

const PAIRING_CODE_TTL_MS = 15 * 60 * 1000; // 15 minutes

function generatePairingCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no confusing chars
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
    @InjectRepository(ChildProfile)
    private readonly childRepository: Repository<ChildProfile>,
    private readonly realtimeGateway: RealtimeGateway,
  ) {}

  /** Caregiver registers a new device and gets a fresh pairing code to show on-screen. */
  async register(dto: RegisterDeviceDto) {
    const child = await this.childRepository.findOneBy({ id: dto.childId });
    if (!child) {
      throw new NotFoundException('Không tìm thấy hồ sơ trẻ');
    }

    const device = this.deviceRepository.create({
      deviceName: dto.deviceName,
      deviceType: dto.deviceType,
      child,
      pairingCode: generatePairingCode(),
      pairingCodeExpiresAt: new Date(Date.now() + PAIRING_CODE_TTL_MS),
      paired: false,
    });

    return this.deviceRepository.save(device);
  }

  /** Regenerate an expired/used pairing code for an existing device. */
  async regenerateCode(deviceId: string) {
    const device = await this.findOne(deviceId);
    device.pairingCode = generatePairingCode();
    device.pairingCodeExpiresAt = new Date(Date.now() + PAIRING_CODE_TTL_MS);
    device.paired = false;
    return this.deviceRepository.save(device);
  }

  /** Patient Web app calls this with the 6-char code to complete pairing. */
  async pair(dto: PairDeviceDto) {
    const device = await this.deviceRepository.findOne({
      where: { pairingCode: dto.code.toUpperCase() },
      relations: ['child', 'child.config', 'child.caregiver'],
    });

    if (!device) {
      throw new UnauthorizedException('Mã ghép đôi không hợp lệ');
    }

    if (!device.pairingCodeExpiresAt || device.pairingCodeExpiresAt.getTime() < Date.now()) {
      throw new UnauthorizedException('Mã ghép đôi đã hết hạn');
    }

    device.paired = true;
    device.online = true;
    device.lastSeenAt = new Date();
    await this.deviceRepository.save(device);

    this.realtimeGateway.emitDeviceStatus(device.child.id, device);

    return device;
  }

  findAllByChild(childId: string) {
    return this.deviceRepository.find({ where: { child: { id: childId } } });
  }

  async findOne(id: string) {
    const device = await this.deviceRepository.findOne({
      where: { id },
      relations: ['child'],
    });
    if (!device) {
      throw new NotFoundException('Không tìm thấy thiết bị');
    }
    return device;
  }

  async setOnlineStatus(id: string, online: boolean) {
    const device = await this.findOne(id);
    device.online = online;
    device.lastSeenAt = new Date();
    return this.deviceRepository.save(device);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.deviceRepository.delete(id);
    return { message: 'Đã xoá thiết bị' };
  }
}
