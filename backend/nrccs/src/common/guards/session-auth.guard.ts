import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class SessionAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    // Check if session exists and has user
    if (!request.session || !request.session.user) {
      throw new UnauthorizedException('Not authenticated');
    }

    // Attach user to request for use in controllers
    request.user = request.session.user;

    return true;
  }
}
