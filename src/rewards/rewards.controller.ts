import { Controller, Get, Param, Res } from '@nestjs/common';
import { RewardsService } from './rewards.service';
import type { Response } from 'express'; // FIX: import type

@Controller('rewards')
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Get(':id')
  async getStudentRewards(@Param('id') studentId: string, @Res() res: Response) {
    const rewards = await this.rewardsService.getStudentRewards(studentId);
    return res.status(200).json(rewards);
  }
}