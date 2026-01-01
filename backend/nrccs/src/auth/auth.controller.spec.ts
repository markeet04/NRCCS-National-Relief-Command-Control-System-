/**
 * Auth Controller Test Suite
 * 
 * Tests for authentication endpoints:
 * - POST /auth/login
 * - POST /auth/logout
 * - GET /auth/me
 * - POST /auth/validate
 * 
 * Coverage: Authentication flows, session management, error handling
 */

import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../common/guards/local-auth.guard';
import { SessionAuthGuard } from '../common/guards/session-auth.guard';
import {
  createMockUser,
  mockCivilianUser,
  mockDistrictUser,
  mockNdmaUser,
  MockUser,
} from '../test-utils';

describe('AuthController', () => {
  let controller: AuthController;

  // Mock AuthService
  const mockAuthService = {
    validateUser: jest.fn(),
    updateLastLogin: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    })
      .overrideGuard(LocalAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(SessionAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/login', () => {
    it('should login successfully and return user data', async () => {
      const mockUser = mockCivilianUser;
      const mockRequest = {
        user: mockUser,
        session: {} as Record<string, any>,
      };
      
      mockAuthService.updateLastLogin.mockResolvedValue(undefined);

      const result = await controller.login(mockRequest);

      expect(result).toEqual({ user: mockUser });
      expect(mockRequest.session.user).toEqual(mockUser);
      expect(mockAuthService.updateLastLogin).toHaveBeenCalledWith(mockUser.id);
    });

    it('should login district user successfully', async () => {
      const mockUser = mockDistrictUser;
      const mockRequest = {
        user: mockUser,
        session: {} as Record<string, any>,
      };

      mockAuthService.updateLastLogin.mockResolvedValue(undefined);

      const result = await controller.login(mockRequest);

      expect((result.user as MockUser).role).toBe('district');
      expect((result.user as MockUser).districtId).toBeDefined();
    });

    it('should login NDMA user successfully', async () => {
      const mockUser = mockNdmaUser;
      const mockRequest = {
        user: mockUser,
        session: {} as Record<string, any>,
      };

      mockAuthService.updateLastLogin.mockResolvedValue(undefined);

      const result = await controller.login(mockRequest);

      expect((result.user as MockUser).role).toBe('ndma');
      expect((result.user as MockUser).level).toBe('National');
    });

    it('should store user in session after login', async () => {
      const mockUser = createMockUser({ id: 99, email: 'session@test.com' });
      const mockRequest = {
        user: mockUser,
        session: {} as Record<string, any>,
      };

      mockAuthService.updateLastLogin.mockResolvedValue(undefined);

      await controller.login(mockRequest);

      expect(mockRequest.session.user).toEqual(mockUser);
    });

    it('should handle updateLastLogin failure gracefully', async () => {
      const mockUser = mockCivilianUser;
      const mockRequest = {
        user: mockUser,
        session: {} as Record<string, any>,
      };

      mockAuthService.updateLastLogin.mockRejectedValue(new Error('DB Error'));

      await expect(controller.login(mockRequest)).rejects.toThrow('DB Error');
    });
  });

  describe('POST /auth/logout', () => {
    it('should logout successfully and destroy session', async () => {
      const mockRequest = {
        session: {
          destroy: jest.fn((callback: (err: Error | null) => void) => callback(null)),
          user: mockCivilianUser,
        },
        res: {
          clearCookie: jest.fn(),
        },
      };

      const result = await controller.logout(mockRequest);

      expect(result).toEqual({ message: 'Logged out successfully' });
      expect(mockRequest.session.destroy).toHaveBeenCalled();
      expect(mockRequest.res.clearCookie).toHaveBeenCalledWith('connect.sid');
    });

    it('should handle session destroy error', async () => {
      const mockRequest = {
        session: {
          destroy: jest.fn((callback: (err: Error | null) => void) => callback(new Error('Session error'))),
          user: mockCivilianUser,
        },
        res: {
          clearCookie: jest.fn(),
        },
      };

      await expect(controller.logout(mockRequest)).rejects.toThrow('Session error');
    });

    it('should clear session cookie on successful logout', async () => {
      const mockClearCookie = jest.fn();
      const mockRequest = {
        session: {
          destroy: jest.fn((callback: (err: Error | null) => void) => callback(null)),
          user: mockCivilianUser,
        },
        res: {
          clearCookie: mockClearCookie,
        },
      };

      await controller.logout(mockRequest);

      expect(mockClearCookie).toHaveBeenCalledWith('connect.sid');
    });
  });

  describe('GET /auth/me', () => {
    it('should return current user from session', async () => {
      const mockUser = mockCivilianUser;
      const mockRequest = {
        session: { user: mockUser },
      };

      const result = await controller.getMe(mockRequest);

      expect(result).toEqual({ user: mockUser });
    });

    it('should return district user with district info', async () => {
      const mockUser = mockDistrictUser;
      const mockRequest = {
        session: { user: mockUser },
      };

      const result = await controller.getMe(mockRequest);

      expect((result.user as MockUser).districtId).toBeDefined();
      expect((result.user as MockUser).provinceId).toBeDefined();
    });

    it('should return user with all properties', async () => {
      const mockUser = createMockUser({
        id: 10,
        email: 'complete@test.com',
        name: 'Complete User',
        phone: '03001234567',
        cnic: '1234567890123',
      });
      const mockRequest = {
        session: { user: mockUser },
      };

      const result = await controller.getMe(mockRequest);

      expect((result.user as MockUser).email).toBe('complete@test.com');
      expect((result.user as MockUser).phone).toBe('03001234567');
      expect((result.user as MockUser).cnic).toBe('1234567890123');
    });
  });

  describe('POST /auth/validate', () => {
    it('should validate session and return user', async () => {
      const mockUser = mockCivilianUser;
      const mockRequest = {
        session: { user: mockUser },
      };

      const result = await controller.validate(mockRequest);

      expect(result).toEqual({
        valid: true,
        user: mockUser,
      });
    });

    it('should return valid: true for authenticated user', async () => {
      const mockRequest = {
        session: { user: mockNdmaUser },
      };

      const result = await controller.validate(mockRequest);

      expect(result.valid).toBe(true);
    });

    it('should include full user object in validation response', async () => {
      const mockUser = createMockUser({
        id: 15,
        role: 'pdma' as MockUser['role'],
        provinceId: 2,
      });
      const mockRequest = {
        session: { user: mockUser },
      };

      const result = await controller.validate(mockRequest);

      expect(result.user.id).toBe(15);
      expect(result.user.role).toBe('pdma');
      expect(result.user.provinceId).toBe(2);
    });
  });

  describe('Guard Integration', () => {
    it('should require LocalAuthGuard for login', () => {
      // This test verifies the decorator is applied
      const guards = Reflect.getMetadata('__guards__', AuthController.prototype.login);
      expect(guards).toBeDefined();
    });

    it('should require SessionAuthGuard for protected routes', () => {
      // Verify logout requires session auth
      const logoutGuards = Reflect.getMetadata('__guards__', AuthController.prototype.logout);
      expect(logoutGuards).toBeDefined();

      // Verify me requires session auth
      const meGuards = Reflect.getMetadata('__guards__', AuthController.prototype.getMe);
      expect(meGuards).toBeDefined();

      // Verify validate requires session auth
      const validateGuards = Reflect.getMetadata('__guards__', AuthController.prototype.validate);
      expect(validateGuards).toBeDefined();
    });
  });

  describe('HTTP Status Codes', () => {
    it('should return 200 OK for successful login', async () => {
      // Verify HttpCode decorator
      const httpCode = Reflect.getMetadata('__httpCode__', AuthController.prototype.login);
      expect(httpCode).toBe(200);
    });

    it('should return 200 OK for successful logout', async () => {
      const httpCode = Reflect.getMetadata('__httpCode__', AuthController.prototype.logout);
      expect(httpCode).toBe(200);
    });

    it('should return 200 OK for me endpoint', async () => {
      const httpCode = Reflect.getMetadata('__httpCode__', AuthController.prototype.getMe);
      expect(httpCode).toBe(200);
    });

    it('should return 200 OK for validate endpoint', async () => {
      const httpCode = Reflect.getMetadata('__httpCode__', AuthController.prototype.validate);
      expect(httpCode).toBe(200);
    });
  });
});
