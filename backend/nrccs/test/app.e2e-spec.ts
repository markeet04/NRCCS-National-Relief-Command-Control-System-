/**
 * NRCCS E2E Test - Minimal Application Boot Test
 *
 * This is a CI-safe E2E test that verifies the application can boot
 * and respond to basic health check requests without requiring
 * real database connections.
 *
 * For comprehensive API testing, use the controller unit tests
 * which mock all external dependencies.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppController } from './../src/app.controller';
import { AppService } from './../src/app.service';

describe('NRCCS Application (E2E)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    // Create a minimal test module without database dependencies
    // This ensures the test runs in CI without external services
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Apply the same pipes as the main application
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  // ============================================
  // Health Check Tests
  // ============================================

  describe('Health Check', () => {
    it('GET / - should return 200 with welcome message', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('Hello World!');
    });

    it('GET / - should respond within acceptable time', async () => {
      const startTime = Date.now();

      await request(app.getHttpServer()).get('/').expect(200);

      const responseTime = Date.now() - startTime;
      expect(responseTime).toBeLessThan(1000); // Should respond within 1 second
    });
  });

  // ============================================
  // Application Bootstrap Tests
  // ============================================

  describe('Application Bootstrap', () => {
    it('should have initialized the application', () => {
      expect(app).toBeDefined();
    });

    it('should have HTTP server running', () => {
      const server = app.getHttpServer();
      expect(server).toBeDefined();
    });

    it('should handle unknown routes with 404', () => {
      return request(app.getHttpServer())
        .get('/non-existent-route-12345')
        .expect(404);
    });
  });

  // ============================================
  // Request Handling Tests
  // ============================================

  describe('Request Handling', () => {
    it('should handle GET requests', async () => {
      const response = await request(app.getHttpServer()).get('/');

      expect(response.status).toBe(200);
      expect(response.text).toBeDefined();
    });

    it('should return proper content type', async () => {
      const response = await request(app.getHttpServer()).get('/');

      expect(response.status).toBe(200);
      // Text response should have text content type
      expect(response.type).toMatch(/text/);
    });
  });
});
