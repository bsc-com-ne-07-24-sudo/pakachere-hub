import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { LessonsModule } from './lessons/lessons.module'; // Add this line
import { UsersModule } from './users/users.module';
import { AssessmentsModule } from './assessments/assessments.module';
import { RewardsModule } from './rewards/rewards.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    DatabaseModule, 
    AuthModule, 
    LessonsModule, UsersModule, AssessmentsModule, RewardsModule, ReportsModule // Add this line
  ],
})
export class AppModule {}