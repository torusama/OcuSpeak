import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

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

import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import firebaseConfig from './config/firebase.config';

import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      load: [databaseConfig, jwtConfig, firebaseConfig],
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('database.host'),
        port: config.get<number>('database.port'),
        username: config.get<string>('database.username'),
        password: config.get<string>('database.password'),
        database: config.get<string>('database.database'),
        autoLoadEntities: true,
        synchronize: config.get<string>('NODE_ENV') !== 'production',
        logging: config.get<string>('NODE_ENV') === 'development',
      }),
    }),

    FirebaseModule,
    SocketModule,
    AuthModule,
    CaregiverModule,
    ChildModule,
    DeviceModule,
    AacModule,
    CommunicationModule,
    MonitoringModule,
    SosModule,
  ],

  controllers: [AppController],

  providers: [
    AppService,
    { provide: APP_PIPE, useValue: new ValidationPipe({ whitelist: true, transform: true }) },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
  ],
})
export class AppModule {}
