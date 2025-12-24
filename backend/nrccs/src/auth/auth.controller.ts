import { Controller, Post, Get, UseGuards, Req, HttpCode, HttpStatus, Session } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../common/guards/local-auth.guard';
import { SessionAuthGuard } from '../common/guards/session-auth.guard';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async login(@Req() req: any): Promise<{ user: any }> {
    // User is attached by LocalAuthGuard after successful authentication
    const user = req.user;
    
    // Store user in session
    req.session.user = user;
    
    // Update last login
    await this.authService.updateLastLogin(user.id);
    
    return { user };
  }

  @Post('logout')
  @UseGuards(SessionAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: any): Promise<{ message: string }> {
    return new Promise((resolve, reject) => {
      req.session.destroy((err: any) => {
        if (err) {
          reject(err);
        } else {
          req.res.clearCookie('connect.sid'); // Clear the session cookie
          resolve({ message: 'Logged out successfully' });
        }
      });
    });
  }

  @Get('me')
  @UseGuards(SessionAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getMe(@Req() req: any): Promise<{ user: any }> {
    return { user: req.session.user };
  }

  @Post('validate')
  @UseGuards(SessionAuthGuard)
  @HttpCode(HttpStatus.OK)
  async validate(@Req() req: any): Promise<{ valid: boolean; user: any }> {
    return {
      valid: true,
      user: req.session.user,
    };
  }
}
