import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from '../database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy'; 
import { RolesGuard } from './guards/roles.guard'; // Add this

@Module({
  imports: [
    DatabaseModule,
    PassportModule,
    JwtModule.register({
      // Keep your specific 2026 key
      secret: 'PAKACHERE_SECRET_KEY_2026',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    JwtStrategy, 
    RolesGuard // Adding this here makes it available for injection
  ], 
  exports: [AuthService, JwtModule], // Export JwtModule so other modules can use the guard
})
export class AuthModule {}