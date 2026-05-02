import { Controller, Get, Param, Res, HttpStatus } from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { Response } from 'express';

@Controller('api/v1/students')
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Get(':id/rewards')
  async getStudentRewards(@Param('id') studentId: string, @Res() res: Response) {
    try {
      const rewards = await this.rewardsService.getRewardsByStudent(studentId);
      return res.status(HttpStatus.OK).json({
        studentId,
        rewards: rewards
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Error fetching rewards",
        error: error.message
      });
    }
  }
}