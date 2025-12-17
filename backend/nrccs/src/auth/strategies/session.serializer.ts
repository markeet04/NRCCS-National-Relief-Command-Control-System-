import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { AuthService } from '../auth.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly authService: AuthService) {
    super();
  }

  serializeUser(user: any, done: (err: Error | null, user: any) => void): any {
    // Store only user ID in session
    done(null, user.id);
  }

  async deserializeUser(userId: number, done: (err: Error | null, user: any) => void): Promise<any> {
    try {
      // Retrieve full user data from database
      const user = await this.authService.getUserById(userId);
      done(null, user);
    } catch (err) {
      done(err as Error, null);
    }
  }
}
