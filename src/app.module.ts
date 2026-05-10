import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { LessonsModule } from './lessons/lessons.module';
import { UsersModule } from './users/users.module';
import { AssessmentsModule } from './assessments/assessments.module';
import { RewardsModule } from './rewards/rewards.module';
import { ReportsModule } from './reports/reports.module';
// 1. Import the new ExamsModule
import { ExamsModule } from './exams/exams.module';

@Module({
  imports: [
    DatabaseModule, 
    AuthModule, 
    LessonsModule, 
    UsersModule, 
    AssessmentsModule, 
    RewardsModule, 
    ReportsModule,
    // 2. Add ExamsModule to the imports array
    ExamsModule 
  ],
})
export class AppModule {}