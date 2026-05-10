import { Controller, Get, Post, Body, Param, UseGuards, Patch } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin') // Strict: Only Admins can access any route here
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  async listUsers() {
    return await this.adminService.getAllUsers();
  }

  @Patch('users/role')
  async changeRole(@Body() body: { userId: number, role: string }) {
    return await this.adminService.updateUserRole(body.userId, body.role);
  }

  @Get('lessons/pending')
  async pendingLessons() {
    return await this.adminService.getPendingLessons();
  }

  @Post('lessons/approve/:id')
  async approve(@Param('id') id: number) {
    return await this.adminService.updateLessonStatus(id, 'Approved');
  }

  @Post('lessons/reject/:id')
  async reject(@Param('id') id: number) {
    return await this.adminService.updateLessonStatus(id, 'Rejected');
  }
}