import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AssessmentsService } from './assessments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('assessments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AssessmentsController {
  constructor(private readonly assessmentsService: AssessmentsService) {}

  // Students submit their answers here
  @Post('submit/:assessmentId')
  @Roles('student')
  async submit(
    @Request() req: any, 
    @Param('assessmentId') assessmentId: number, 
    @Body() answers: any
  ) {
    // Pulls studentId from JWT and assessmentId from URL
    return await this.assessmentsService.submitScore(
      req.user.userId, 
      assessmentId, 
      answers
    );
  }

  // Students can see their past scores
  @Get('my-scores')
  @Roles('student')
  async getMyScores(@Request() req: any) {
    return await this.assessmentsService.getRecentSubmissions(req.user.userId);
  }
}