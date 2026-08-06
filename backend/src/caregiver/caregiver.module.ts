import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CaregiverController } from './caregiver.controller';
import { CaregiverService } from './caregiver.service';

import { Caregiver } from './entities/caregiver.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Caregiver,
    ]),
  ],

  controllers: [
    CaregiverController,
  ],

  providers: [
    CaregiverService,
  ],

  exports: [
    TypeOrmModule,
  ],
})
export class CaregiverModule {}