import { Controller, Get, Res, HttpStatus, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Response } from 'express';

@Controller('api/reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  async getSystemOverview(@Res() res: Response) {
    try {
      const reportData = await this.reportsService.generateOverview();
      return res.status(HttpStatus.OK).json({
        generatedAt: new Date().toISOString(),
        data: reportData
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Failed to generate admin reports",
        error: error.message
      });
    }
  }
}