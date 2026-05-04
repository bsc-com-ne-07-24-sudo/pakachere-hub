import { Controller, Get, Post, Body, Res } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import type { Response } from 'express'; // FIX: import type

@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get()
  async getAllLessons(@Res() res: Response) {
    const lessons = await this.lessonsService.findAll();
    return res.status(200).json(lessons);
  }

  @Post()
  async createLesson(@Body() lessonData: any, @Res() res: Response) {
    const newLesson = await this.lessonsService.create(lessonData);
    return res.status(201).json(newLesson);
  }
}