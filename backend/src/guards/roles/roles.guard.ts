import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { SessionData } from 'express-session';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const session: SessionData = request.session;

    if (session && session.isAdmin) {
      return true;
    }
  }
}
