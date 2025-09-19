import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY, ROLES_KEY } from '../decorators/allDecorator';
import { Request as ExpressRequest } from 'express';
import { PayloadSchema } from 'src/schema/payload.schema';

type AuthRequest = ExpressRequest & { user?: PayloadSchema };

@Injectable()
export class AuthzGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest<AuthRequest>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Role check
    if (requiredRoles && !requiredRoles.includes(user.role)) {
      throw new ForbiddenException(`Role "${user.role}" not allowed`);
    }

    // Permission check
    if (requiredPermissions) {
      const hasAllPermissions = requiredPermissions.every(p =>
        user.permissions.includes(p),
      );
      if (!hasAllPermissions) {
        throw new ForbiddenException(`Missing required permissions`);
      }
    }

    return true;
  }
}



// @Controller('patients')
// @UseGuards(JwtAuthGuard, AuthzGuard) // applied once here
// @Roles('Doctor') // default: all routes need Doctor role
// export class PatientsController {
  
//   @Get()
//   @Permissions('read:patients')
//   findAll() {
//     return 'All patients';
//   }

//   @Post()
//   @Permissions('create:patients')
//   createPatient() {
//     return 'Patient created';
//   }

//   @Delete(':id')
//   @Roles('Admin') // overrides Doctor
//   @Permissions('delete:patients')
//   deletePatient() {
//     return 'Patient deleted';
//   }
// }