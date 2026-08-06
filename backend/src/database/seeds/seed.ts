import { NestFactory } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { AppModule } from '../../app.module';
import { Caregiver, CaregiverRole } from '../../caregiver/entities/caregiver.entity';
import { ChildProfile } from '../../child/entities/child.entity';
import { ChildConfig, AacGridSize, AacImageStyle, AacResponseType } from '../../child/entities/child-config.entity';
import { Device, DeviceType } from '../../device/entities/device.entity';
import { AacItem, AacCategory } from '../../aac/entities/aac-item.entity';
import { CommunicationEvent, CommunicationStatus } from '../../communication/entities/communication-event.entity';
import { CaregiverResponse, ResponseType } from '../../communication/entities/caregiver-response.entity';
import { MonitoringRecord, MonitoringType } from '../../monitoring/entities/monitoring-record.entity';
import { SosAlert, SosStatus } from '../../sos/entities/sos-alert.entity';

/**
 * Seeds the database with a realistic mock caregiver + child + device + AAC
 * grid + a few communication/monitoring/sos records so the whole team
 * (backend, Patient Web, Caregiver App) can develop and demo against real
 * API responses without waiting for production data.
 *
 * Usage: npm run seed
 */
async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const caregiverRepo = app.get<Repository<Caregiver>>(getRepositoryToken(Caregiver));
  const childRepo = app.get<Repository<ChildProfile>>(getRepositoryToken(ChildProfile));
  const configRepo = app.get<Repository<ChildConfig>>(getRepositoryToken(ChildConfig));
  const deviceRepo = app.get<Repository<Device>>(getRepositoryToken(Device));
  const aacRepo = app.get<Repository<AacItem>>(getRepositoryToken(AacItem));
  const eventRepo = app.get<Repository<CommunicationEvent>>(getRepositoryToken(CommunicationEvent));
  const responseRepo = app.get<Repository<CaregiverResponse>>(getRepositoryToken(CaregiverResponse));
  const monitoringRepo = app.get<Repository<MonitoringRecord>>(getRepositoryToken(MonitoringRecord));
  const sosRepo = app.get<Repository<SosAlert>>(getRepositoryToken(SosAlert));

  console.log('🌱 Đang xoá dữ liệu cũ...');
  for (const repo of [
    sosRepo,
    monitoringRepo,
    responseRepo,
    eventRepo,
    aacRepo,
    deviceRepo,
    configRepo,
    childRepo,
    caregiverRepo,
  ]) {
    await repo.query(`TRUNCATE TABLE "${repo.metadata.tableName}" CASCADE`);
  }

  console.log('🌱 Tạo caregiver mẫu...');
  const caregiver = await caregiverRepo.save(
    caregiverRepo.create({
      fullName: 'Võ Tấn An',
      email: 'demo@ocuspeak.dev',
      password: await bcrypt.hash('demo123456', 10),
      phone: '0901234567',
      role: CaregiverRole.PARENT,
    }),
  );

  console.log('🌱 Tạo hồ sơ trẻ mẫu...');
  const child = await childRepo.save(
    childRepo.create({
      fullName: 'Bé Bảo An',
      birthday: new Date('2019-05-10'),
      gender: 'female',
      diagnosis: 'Bại não thể co cứng, hạn chế vận động tay chân',
      language: 'vi',
      caregiver,
    }),
  );

  console.log('🌱 Tạo cấu hình riêng cho trẻ...');
  await configRepo.save(
    configRepo.create({
      child,
      gridSize: AacGridSize.GRID_3X3,
      dwellTimeMs: 1200,
      imageStyle: AacImageStyle.SYMBOL,
      responseType: AacResponseType.EYE_GAZE,
      voiceOutputEnabled: true,
      speechRate: 1.0,
    }),
  );

  console.log('🌱 Tạo thiết bị Patient Web đã ghép đôi...');
  const device = await deviceRepo.save(
    deviceRepo.create({
      deviceName: 'iPad của Bảo An',
      deviceType: DeviceType.PATIENT_WEB,
      pairingCode: 'DEMO01',
      pairingCodeExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      paired: true,
      online: true,
      lastSeenAt: new Date(),
      child,
    }),
  );

  console.log('🌱 Tạo bộ AAC item mẫu...');
  const aacSeeds: Array<Partial<AacItem>> = [
    { label: 'Nước', category: AacCategory.NEED, quickSentence: 'Con muốn uống nước ạ', sortOrder: 0 },
    { label: 'Đói bụng', category: AacCategory.NEED, quickSentence: 'Con đói bụng rồi ạ', sortOrder: 1 },
    { label: 'Vệ sinh', category: AacCategory.NEED, quickSentence: 'Con muốn đi vệ sinh ạ', sortOrder: 2 },
    { label: 'Đau', category: AacCategory.PAIN, quickSentence: 'Con thấy đau ạ', sortOrder: 3 },
    { label: 'Mệt', category: AacCategory.FEELING, quickSentence: 'Con mệt, muốn nghỉ ngơi', sortOrder: 4 },
    { label: 'Vui', category: AacCategory.FEELING, quickSentence: 'Con đang vui!', sortOrder: 5 },
    { label: 'Chào mẹ', category: AacCategory.SOCIAL, quickSentence: 'Con chào mẹ ạ', sortOrder: 6 },
    { label: 'Xem TV', category: AacCategory.ACTIVITY, quickSentence: 'Con muốn xem TV', sortOrder: 7 },
    { label: 'Nghe nhạc', category: AacCategory.ACTIVITY, quickSentence: 'Con muốn nghe nhạc', sortOrder: 8 },
  ];
  const aacItems = await aacRepo.save(aacSeeds.map((item) => aacRepo.create({ ...item, child })));

  console.log('🌱 Tạo lịch sử communication events + phản hồi caregiver...');
  const event1 = await eventRepo.save(
    eventRepo.create({
      child,
      itemIds: [aacItems[0].id],
      sentence: aacItems[0].quickSentence,
      status: CommunicationStatus.RESPONDED,
      unread: false,
    }),
  );
  await responseRepo.save(
    responseRepo.create({
      event: event1,
      caregiver,
      type: ResponseType.TEXT,
      content: 'Mẹ mang nước cho con ngay đây',
      delivered: true,
    }),
  );

  await eventRepo.save(
    eventRepo.create({
      child,
      itemIds: [aacItems[4].id],
      sentence: aacItems[4].quickSentence,
      status: CommunicationStatus.SENT,
      unread: true,
    }),
  );

  console.log('🌱 Tạo bản ghi monitoring...');
  await monitoringRepo.save([
    monitoringRepo.create({ child, device, type: MonitoringType.DEVICE_ONLINE }),
    monitoringRepo.create({
      child,
      device,
      type: MonitoringType.CALIBRATION,
      metadata: { accuracy: 0.94 },
    }),
  ]);

  console.log('🌱 Tạo một SOS alert đã xử lý xong (demo lịch sử)...');
  await sosRepo.save(
    sosRepo.create({
      child,
      device,
      status: SosStatus.RESOLVED,
      note: 'Trẻ khó chịu, mẹ đã tới hỗ trợ',
      acknowledgedAt: new Date(Date.now() - 60 * 1000),
      resolvedAt: new Date(),
    }),
  );

  console.log('\n✅ Seed hoàn tất!');
  console.log('----------------------------------------');
  console.log('Đăng nhập Caregiver App:');
  console.log('  email:    demo@ocuspeak.dev');
  console.log('  password: demo123456');
  console.log(`Caregiver ID: ${caregiver.id}`);
  console.log(`Child ID:     ${child.id}`);
  console.log('Mã ghép đôi Patient Web: DEMO01');
  console.log('----------------------------------------');

  await app.close();
}

seed().catch((err) => {
  console.error('❌ Seed thất bại:', err);
  process.exit(1);
});
