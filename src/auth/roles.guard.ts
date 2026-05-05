import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. What roles are required for this specific route?
    // CHANGE THIS:
const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
  context.getHandler(),
  context.getClass(), // <--- Update this from getContext to getClass
]);

    // 2. If no roles are required, let everyone in
    if (!requiredRoles) {
      return true;
    }

    // 3. Get the user from the Request (populated by the JwtStrategy)
    const { user } = context.switchToHttp().getRequest();

    // 4. Check if the user's role matches one of the required roles
    // Remember: we stored user.role in the JWT payload in AuthService.login
    return requiredRoles.some((role) => user?.role?.toLowerCase() === role.toLowerCase());
  }
}