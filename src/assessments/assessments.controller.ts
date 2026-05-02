import { Controller, Get, Post, Body, Param, Res, HttpStatus } from '@nestjs/common';
import { AssessmentsService } from './assessments.service';
import { Response } from 'express';

@Controller('api/v1')
export class AssessmentsController {
  constructor(private readonly assessmentsService: AssessmentsService) {}

  // For Teachers: Create an assessment
  @Post('assessments')
  async create(@Body() data: any, @Res() res: Response) {
    const result = await this.assessmentsService.createAssessment(data);
    return res.status(HttpStatus.CREATED).json(result);
  }

  // For Students: Get a specific quiz
  @Get('students/:id/assessments/:assessmentId')
  async getQuiz(@Param('assessmentId') quizId: string, @Res() res: Response) {
    const quiz = await this.assessmentsService.getQuiz(quizId);
    return res.status(HttpStatus.OK).json(quiz);
  }

  // For Students: Submit answers
  @Post('students/:id/assessments/:assessmentId')
  async submit(@Param('id') studentId: string, @Param('assessmentId') quizId: string, @Body() answers: any, @Res() res: Response) {
    const score = await this.assessmentsService.submitAnswers(studentId, quizId, answers);
    return res.status(HttpStatus.OK).json({ score, message: "Assessment submitted successfully" });
  }
}