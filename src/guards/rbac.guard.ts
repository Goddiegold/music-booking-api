import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '@prisma/client';

@Injectable()
export class RBACGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest();

    const permittedRoles =
      this.reflector.get<string[]>('roles', context.getHandler()) || [];

    if (!permittedRoles.length) {
      return true;
    }

    const user = req.user as User;
    // console.log(user);
    // console.log(permittedRoles);
    const hasPermission = permittedRoles.includes(user.role as string);

    if (user && user.role && hasPermission) {
      return true;
    } else {
      if (!user?.role) {
        throw new ForbiddenException({
          success: false,
          message: 'Ensure you have gone through the onboarding endpoint!',
        });
      }
      throw new ForbiddenException({
        success: false,
        message: 'Forbidden resource: Insufficient permissions',
      });
    }
  }
}
