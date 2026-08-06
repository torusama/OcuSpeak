import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChildController } from './child.controller';
import { ChildService } from './child.service';
import { ChildProfile } from './entities/child.entity';
import { ChildConfig } from './entities/child-config.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChildProfile, ChildConfig])],
  controllers: [ChildController],
  providers: [ChildService],
  exports: [TypeOrmModule, ChildService],
})
export class ChildModule {}
