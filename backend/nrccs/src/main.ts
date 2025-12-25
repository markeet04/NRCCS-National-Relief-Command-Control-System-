import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import session from 'express-session';
import passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configure session middleware
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'nrccs-session-secret-change-in-production',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        sameSite: 'lax',
      },
    }),
  );

  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Enable CORS for frontend with credentials
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  // Enable validation globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false, // Allow extra fields (they'll be stripped)
      transform: true,
      transformOptions: {
        enableImplicitConversion: true, // Auto-convert string to number, etc.
      },
    }),
  );

  // Global prefix for all routes
  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 NRCCS Backend running on http://localhost:${process.env.PORT ?? 3000}`);
}
bootstrap();
