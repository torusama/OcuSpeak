import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { CaregiverModule } from './caregiver/caregiver.module';
import { ChildModule } from './child/child.module';
import { DeviceModule } from './device/device.module';
import { AacModule } from './aac/aac.module';
import { CommunicationModule } from './communication/communication.module';
import { MonitoringModule } from './monitoring/monitoring.module';
import { SosModule } from './sos/sos.module';
import { FirebaseModule } from './firebase/firebase.module';
import { SocketModule } from './socket/socket.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',

      host: process.env.DATABASE_HOST,

      port: Number(process.env.DATABASE_PORT),

      username: process.env.DATABASE_USER,

      password: process.env.DATABASE_PASSWORD,

      database: process.env.DATABASE_NAME,

      autoLoadEntities: true,

      synchronize: true,

      logging: true,
    }),

    AuthModule,
    CaregiverModule,
    ChildModule,
    DeviceModule,
    AacModule,
    CommunicationModule,
    MonitoringModule,
    SosModule,
    FirebaseModule,
    SocketModule,
  ],

  controllers: [AppController],

  providers: [AppService],
})
export class AppModule {}