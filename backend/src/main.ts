import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security middleware
  app.use(helmet());

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Enable CORS with support for preview deployments
  const explicitOrigins = [
    process.env.FRONTEND_URL?.trim().replace(/\/$/, ''),
    process.env.FRONTEND_PREVIEW_URL?.trim().replace(/\/$/, ''),
    'http://localhost:5173',
  ].filter(Boolean) as string[];

  const vercelProjectSlug = (process.env.FRONTEND_VERCEL_PROJECT || 'billing-fo-rge-frontend').trim();

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      const normalizedOrigin = origin.replace(/\/$/, '');

      const isExplicit = explicitOrigins.includes(normalizedOrigin);
      const isVercelPreview =
        normalizedOrigin.endsWith('.vercel.app') && normalizedOrigin.includes(vercelProjectSlug);

      if (isExplicit || isVercelPreview) {
        return callback(null, true);
      }

      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  });

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Billing API')
    .setDescription('Admin-driven utility bill calculation API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

bootstrap();
