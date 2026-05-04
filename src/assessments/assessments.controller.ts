import { Controller, Post, Get, Body, Param, Res } from '@nestjs/common';
import { AssessmentsService } from './assessments.service';
// FIX: Use 'import type' for Express Response
import type { Response } from 'express';

@Controller('assessments')
export class AssessmentsController {
  constructor(private readonly assessmentsService: AssessmentsService) {}

  @Post()
  async create(@Body() data: any, @Res() res: Response) {
    const result = await this.assessmentsService.create(data);
    return res.status(201).json(result);
  }

  @Get(':assessmentId')
  async getQuiz(@Param('assessmentId') quizId: string, @Res() res: Response) {
    const quiz = await this.assessmentsService.getQuiz(quizId);
    return res.status(200).json(quiz);
  }

  @Post(':id/submit/:assessmentId')
  async submit(
    @Param('id') studentId: string, 
    @Param('assessmentId') quizId: string, 
    @Body() answers: any, 
    @Res() res: Response
  ) {
    const result = await this.assessmentsService.submitScore(studentId, quizId, answers);
    return res.status(200).json(result);
  }
}