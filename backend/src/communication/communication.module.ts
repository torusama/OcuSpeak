import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommunicationController } from './communication.controller';
import { CommunicationService } from './communication.service';
import { CommunicationEvent } from './entities/communication-event.entity';
import { CaregiverResponse } from './entities/caregiver-response.entity';
import { ChildProfile } from '../child/entities/child.entity';
import { SocketModule } from '../socket/socket.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommunicationEvent, CaregiverResponse, ChildProfile]),
    SocketModule,
  ],
  controllers: [CommunicationController],
  providers: [CommunicationService],
  exports: [TypeOrmModule, CommunicationService],
})
export class CommunicationModule {}
