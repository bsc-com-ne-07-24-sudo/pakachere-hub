import { SetMetadata } from '@nestjs/common';

// This allows us to use @Roles('admin') on our controllers
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);