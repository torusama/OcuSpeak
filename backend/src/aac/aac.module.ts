import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AacController } from './aac.controller';
import { AacService } from './aac.service';
import { AacItem } from './entities/aac-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AacItem])],
  controllers: [AacController],
  providers: [AacService],
  exports: [TypeOrmModule, AacService],
})
export class AacModule {}
