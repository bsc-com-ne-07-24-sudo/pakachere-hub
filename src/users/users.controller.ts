import { Controller, Post, Body, Res, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import type { Response } from 'express'; // FIX: import type

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post(':id/exams/register')
  async registerForExam(
    @Param('id') studentId: string,
    @Body() examData: any,
    @Res() res: Response
  ) {
    const result = await this.usersService.registerExam(studentId, examData);
    return res.status(201).json(result);
  }
}