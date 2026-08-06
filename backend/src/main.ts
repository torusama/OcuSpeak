import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const corsOrigins = (configService.get<string>('CORS_ORIGINS') || '*')
    .split(',')
    .map((origin) => origin.trim());

  app.enableCors({
    origin: corsOrigins.includes('*') ? true : corsOrigins,
    credentials: true,
  });

  app.setGlobalPrefix('api');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('OcuSpeak API')
    .setDescription(
      'API dùng chung cho Patient Web (thiết bị giao tiếp bằng ánh mắt của trẻ) và Caregiver App (ứng dụng của người giám hộ).',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = configService.get<number>('PORT') ?? 3000;
  await app.listen(port);

  Logger.log(`🚀 OcuSpeak backend chạy tại: http://localhost:${port}/api`);
  Logger.log(`📘 Swagger docs tại: http://localhost:${port}/api/docs`);
  Logger.log(`🔌 Realtime socket namespace: /realtime`);
}
bootstrap();
