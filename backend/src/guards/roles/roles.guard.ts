import {CanActivate, ExecutionContext, ForbiddenException, Injectable} from '@nestjs/common';
import { Observable } from 'rxjs';
import {Reflector} from "@nestjs/core";
import {AdminService} from "../../users/admin/admin.service";

@Injectable()
export class RolesGuard implements CanActivate {

  constructor(
      private reflector: Reflector,
      private adminService: AdminService,
  ) {}

  async canActivate(
      context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const isAdmin = await this.adminService.isAdmin(user.username);

    if (isAdmin) {
      return true;
    }

    throw new ForbiddenException('You do not have permission to access this resource');
  }
}
