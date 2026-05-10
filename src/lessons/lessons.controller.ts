import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // You should have this
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('lessons')
@UseGuards(JwtAuthGuard, RolesGuard) // Protect everything with JWT and Roles
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get()
  @Roles('student', 'teacher') // Both can view
  async getAllLessons() {
    const lessons = await this.lessonsService.findAll();
    return { data: lessons };
  }

  @Post()
  @Roles('teacher') // ONLY teachers can create
  async createLesson(@Body() lessonData: any) {
    return await this.lessonsService.create(lessonData);
  }

  @Get()
@Roles('student', 'teacher', 'admin')
async getLessons() {
  // Students only see what has been cleared by an admin
  return await this.lessonsService.findApproved();
}
}