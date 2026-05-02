import { Controller, Get, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { Response } from 'express';

@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  // Existing route to get all lessons
  @Get()
  async getAllLessons(@Res() res: Response) {
    try {
      const lessons = await this.lessonsService.findAll();
      return res.status(HttpStatus.OK).json(lessons);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error fetching lessons',
        error: error.message,
      });
    }
  }

  // NEW: Route for Teachers to create a lesson
  @Post('create')
  async createLesson(@Body() lessonData: any, @Res() res: Response) {
    try {
      const newLesson = await this.lessonsService.create(lessonData);
      return res.status(HttpStatus.CREATED).json({
        message: 'Lesson created successfully',
        data: newLesson,
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Failed to create lesson',
        error: error.message,
      });
    }
  }
}