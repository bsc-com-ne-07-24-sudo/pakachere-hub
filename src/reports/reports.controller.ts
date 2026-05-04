import { Controller, Get, Res } from '@nestjs/common';
import { ReportsService } from './reports.service';
import type { Response } from 'express'; // FIX: import type

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  async getSystemOverview(@Res() res: Response) {
    const data = await this.reportsService.getStats();
    return res.status(200).json(data);
  }
}