import { NestFactory } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

import { AppModule } from '../app.module';
import { Caregiver, CaregiverRole } from '../caregiver/entities/caregiver.entity';
import { ChildProfile } from '../child/entities/child.entity';
import { ChildConfig, AacGridSize, AacImageStyle, AacResponseType } from '../child/entities/child-config.entity';
import { Device, DeviceType } from '../device/entities/device.entity';
import { AacItem, AacCategory } from '../aac/entities/aac-item.entity';
import { CommunicationEvent, CommunicationStatus } from '../communication/entities/communication-event.entity';

const DEMO_PASSWORD = 'demo1234';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const caregiverRepo = app.get(getRepositoryToken(Caregiver));
  const childRepo = app.get(getRepositoryToken(ChildProfile));
  const childConfigRepo = app.get(getRepositoryToken(ChildConfig));
  const deviceRepo = app.get(getRepositoryToken(Device));
  const aacItemRepo = app.get(getRepositoryToken(AacItem));
  const eventRepo = app.get(getRepositoryToken(CommunicationEvent));

  console.log('🌱 Seeding OcuSpeak mock data...');

  // Wipe in FK-safe order (dev only — never run against production).
  await eventRepo.delete({});
  await aacItemRepo.delete({});
  await deviceRepo.delete({});
  await childConfigRepo.delete({});
  await childRepo.delete({});
  await caregiverRepo.delete({});

  const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10);

  const caregiver = await caregiverRepo.save(
    caregiverRepo.create({
      fullName: 'Võ Tấn An',
      email: 'caregiver@ocuspeak.dev',
      password: hashedPassword,
      phone: '0901234567',
      role: CaregiverRole.PARENT,
    }),
  );

  const child = await childRepo.save(
    childRepo.create({
      fullName: 'Bé Minh Anh',
      birthday: new Date('2019-05-10'),
      gender: 'female',
      diagnosis: 'Bại não thể co cứng, hạn chế vận động tay chân',
      language: 'vi',
      caregiver,
    }),
  );

  await childConfigRepo.save(
    childConfigRepo.create({
      child,
      gridSize: AacGridSize.GRID_3X3,
      dwellTimeMs: 1200,
      imageStyle: AacImageStyle.SYMBOL,
      responseType: AacResponseType.EYE_GAZE,
      voiceOutputEnabled: true,
      speechRate: 1.0,
    }),
  );

  const device = await deviceRepo.save(
    deviceRepo.create({
      deviceName: 'Patient Web - iPad bé Minh Anh',
      deviceType: DeviceType.PATIENT_WEB,
      pairingCode: 'DEMO01',
      pairingCodeExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      paired: true,
      online: true,
      child,
    }),
  );

  const items: Array<[string, AacCategory, string]> = [
    ['Nước', AacCategory.NEED, 'Con muốn uống nước ạ'],
    ['Đói bụng', AacCategory.NEED, 'Con đói bụng, con muốn ăn'],
    ['Đau', AacCategory.PAIN, 'Con đang bị đau'],
    ['Vui', AacCategory.FEELING, 'Con đang cảm thấy vui'],
    ['Buồn', AacCategory.FEELING, 'Con đang cảm thấy buồn'],
    ['Vệ sinh', AacCategory.NEED, 'Con muốn đi vệ sinh'],
    ['Chào', AacCategory.SOCIAL, 'Con chào mọi người'],
    ['Cảm ơn', AacCategory.SOCIAL, 'Con cảm ơn'],
    ['Xem TV', AacCategory.ACTIVITY, 'Con muốn xem TV'],
  ];

  const savedItems = await aacItemRepo.save(
    items.map(([label, category, quickSentence], index) =>
      aacItemRepo.create({ label, category, quickSentence, sortOrder: index, child }),
    ),
  );

  await eventRepo.save(
    eventRepo.create({
      child,
      itemIds: [savedItems[0].id],
      sentence: savedItems[0].quickSentence,
      status: CommunicationStatus.SENT,
      unread: true,
    }),
  );

  console.log('✅ Seed hoàn tất!');
  console.log('--------------------------------------------------');
  console.log('Caregiver demo:');
  console.log(`  email:    ${caregiver.email}`);
  console.log(`  password: ${DEMO_PASSWORD}`);
  console.log(`Child:      ${child.fullName} (id: ${child.id})`);
  console.log(`Device pairing code (Patient Web): ${device.pairingCode}`);
  console.log('--------------------------------------------------');

  await app.close();
}

seed().catch((error) => {
  console.error('❌ Seed thất bại:', error);
  process.exit(1);
});
