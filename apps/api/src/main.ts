import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('BhuMitraBootstrap');
  const app = await NestFactory.create(AppModule);

  // Security Headers
  app.use(helmet());

  // CORS configuration
  const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',')
    : ['http://localhost:3000', 'http://127.0.0.1:3000'];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // Global prefix for versioned API
  app.setGlobalPrefix('api/v1');

  // Global input validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // OpenAPI / Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('BhuMitra API')
    .setDescription(
      'National Land Acquisition Intelligence & Management Platform API — Government of India',
    )
    .setVersion('1.0.0-sih')
    .addTag('Health', 'Service health check endpoints')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your Bearer token',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'BhuMitra API Docs',
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);

  logger.log(`========================================================`);
  logger.log(`  BHUMITRA — National Land Acquisition Management API`);
  logger.log(`  Running on: http://localhost:${port}/api/v1`);
  logger.log(`  Swagger UI: http://localhost:${port}/api/docs`);
  logger.log(`  Health Check: http://localhost:${port}/api/v1/health`);
  logger.log(`========================================================`);
}

bootstrap();
