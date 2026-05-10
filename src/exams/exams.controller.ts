import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('exams')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Post('register')
  @Roles('student') // Only students can register for exams
  async registerForExam(@Request() req: any, @Body() body: any) {
    // req.user comes from your JwtStrategy validate() method
    return await this.examsService.register(req.user.userId, body);
  }

  @Get('my-registrations')
  @Roles('student')
  async getMyRegistrations(@Request() req: any) {
    return await this.examsService.getMyRegistrations(req.user.userId);
  }

  @Get('all-pending')
  @Roles('teacher') // Only teachers can see the list
  async getPendingRegistrations() {
    return await this.examsService.getPending();
  }

  @Post('approve')
  @Roles('teacher')
  async approveRegistration(@Body() body: { regId: number, status: string }) {
    return await this.examsService.updateStatus(body.regId, body.status);
  }
}