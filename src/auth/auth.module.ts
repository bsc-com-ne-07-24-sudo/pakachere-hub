import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from '../database/database.module'; // IMPORTANT

@Module({
  imports: [DatabaseModule], // Plugs the database into this specific module
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}