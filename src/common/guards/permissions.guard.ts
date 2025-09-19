import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/allDecorator';
import { PayloadSchema } from 'src/schema/payload.schema';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredPermissions || requiredPermissions.length === 0) return true;
    const { user } = context.switchToHttp().getRequest();
    if (!user) return false;
    const userPermissions: string[] = (user as PayloadSchema).permissions || [];
    return requiredPermissions.every((p) => userPermissions.includes(p));
  }
}
