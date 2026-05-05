import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from '../database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
// 1. IMPORT JwtStrategy HERE
import { JwtStrategy } from './jwt.strategy'; 

@Module({
  imports: [
    DatabaseModule,
    PassportModule,
    JwtModule.register({
      secret: 'PAKACHERE_SECRET_KEY_2026',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  // 2. COMBINE into one providers array
  providers: [AuthService, JwtStrategy], 
  exports: [AuthService],
})
export class AuthModule {}