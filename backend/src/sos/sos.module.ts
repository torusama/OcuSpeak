import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SosController } from './sos.controller';
import { SosService } from './sos.service';
import { SosAlert } from './entities/sos-alert.entity';
import { ChildProfile } from '../child/entities/child.entity';
import { SocketModule } from '../socket/socket.module';

@Module({
  imports: [TypeOrmModule.forFeature([SosAlert, ChildProfile]), SocketModule],
  controllers: [SosController],
  providers: [SosService],
  exports: [TypeOrmModule, SosService],
})
export class SosModule {}
