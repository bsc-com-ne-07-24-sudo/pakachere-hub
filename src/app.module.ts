import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { LessonsModule } from './lessons/lessons.module'; // Add this line

@Module({
  imports: [
    DatabaseModule, 
    AuthModule, 
    LessonsModule // Add this line
  ],
})
export class AppModule {}