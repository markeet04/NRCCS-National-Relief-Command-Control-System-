import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import session from 'express-session';
import passport from 'passport';
import { webcrypto } from 'crypto';

// Polyfill for Node 18 compatibility with @nestjs/schedule
// @nestjs/schedule uses crypto.randomUUID() which needs this in Node 18
if (!globalThis.crypto) {
  globalThis.crypto = webcrypto as any;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Trust proxy - required for Azure Container Apps (behind reverse proxy)
  // This ensures secure cookies work correctly behind Azure's ingress
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.set('trust proxy', 1);

  // Configure session middleware
  app.use(
    session({
      secret:
        process.env.SESSION_SECRET ||
        'nrccs-session-secret-change-in-production',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        // Use 'none' for cross-origin cookies between different Azure Container App domains
        // This is required when frontend and backend are on different subdomains
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      },
    }),
  );

  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Enable CORS for frontend with credentials
  // Supports both development (localhost) and production (Cloud Run URL)
  const allowedOrigins = [
    'http://localhost:5173', // Vite dev server
    'http://localhost:3000', // Alternative local
    'http://localhost:8080', // Docker local
    process.env.FRONTEND_URL, // Production URL from env
  ].filter(Boolean); // Remove undefined values

  console.log(`🔐 CORS Allowed Origins:`, allowedOrigins);
  console.log(`📡 FRONTEND_URL env:`, process.env.FRONTEND_URL);

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      // Log all incoming origins for debugging
      console.log(`📨 CORS Request from origin: ${origin}`);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        // TEMPORARY: Allow all origins for debugging (REMOVE IN PRODUCTION)
        console.warn(`⚠️  CORS: Allowing ${origin} (not in strict list)`);
        callback(null, true); // Change to false for production
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
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

  const port = process.env.PORT ?? 3000;
  // Bind to 0.0.0.0 to accept connections from outside the container
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 NRCCS Backend running on port ${port}`);
  console.log(`📡 Listening on http://0.0.0.0:${port}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
}
bootstrap();
