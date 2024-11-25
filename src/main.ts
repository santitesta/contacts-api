import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './global-exception/global-exception.filter';
import { SwaggerAuthMiddleware } from './middlewares/swagger-auth.middleware';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import * as hpp from 'hpp';
import rateLimit from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://contacts-api-ir1x.onrender.com';

  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  });

  app.use(helmet()); // Adds security-related HTTP headers

  app.use(cookieParser());
  app.use(compression()); // Compresses HTTP responses
  app.use(hpp()); // Prevents duplicate query parameters

  // Apply rate limiting globally
  app.use(
    rateLimit({
      windowMs: 60 * 1000, // 1 minute
      max: 100, // Limit each IP to 100 requests per windowMs
      message: 'Too many requests from this IP, please try again later.',
    }),
  );

  app.use('/api', new SwaggerAuthMiddleware().use);

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Contacts API')
    .setDescription('API to manage contacts')
    .setVersion('1.0')
    .addTag('contacts')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
