import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DeviceController } from './device.controller';
import { DeviceService } from './device.service';
import { Device } from './entities/device.entity';
import { ChildProfile } from '../child/entities/child.entity';
import { SocketModule } from '../socket/socket.module';

@Module({
  imports: [TypeOrmModule.forFeature([Device, ChildProfile]), SocketModule],
  controllers: [DeviceController],
  providers: [DeviceService],
  exports: [TypeOrmModule, DeviceService],
})
export class DeviceModule {}
