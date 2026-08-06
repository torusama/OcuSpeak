import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonitoringController } from './monitoring.controller';
import { MonitoringService } from './monitoring.service';
import { MonitoringRecord } from './entities/monitoring-record.entity';
import { SocketModule } from '../socket/socket.module';

@Module({
  imports: [TypeOrmModule.forFeature([MonitoringRecord]), SocketModule],
  controllers: [MonitoringController],
  providers: [MonitoringService],
  exports: [TypeOrmModule, MonitoringService],
})
export class MonitoringModule {}
