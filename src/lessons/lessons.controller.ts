import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { LessonsService } from './lessons.service';
// 1. Change this to a namespace import
import * as express from 'express'; 

@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get()
  // 2. Reference it as express.Response
  async getAll(@Res() res: express.Response) { 
    try {
      const data = await this.lessonsService.findAll();
      
      // Manual serialization to bypass the circular structure crash
      const safeJson = JSON.stringify(data);

      return res
        .status(HttpStatus.OK)
        .header('Content-Type', 'application/json')
        .send(safeJson);
    } catch (e: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(e.message);
    }
  }
}