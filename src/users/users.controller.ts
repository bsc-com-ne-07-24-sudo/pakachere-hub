import { Controller, Post, Param, Body, Res, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { Response } from 'express';

@Controller('api/v1/students')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Existing profile route...

  @Post(':id/exams/register')
  async registerForManeb(
    @Param('id') studentId: string, 
    @Body() examData: { examId: string; subjectCode: string }, 
    @Res() res: Response
  ) {
    try {
      const registration = await this.usersService.registerExam(studentId, examData);
      return res.status(HttpStatus.OK).json({
        message: "Registration successful",
        details: registration
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: "MANEB Registration Failed",
        error: error.message
      });
    }
  }
}