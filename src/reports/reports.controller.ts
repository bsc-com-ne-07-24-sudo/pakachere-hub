import { Controller, Get, UseGuards } from '@nestjs/common';
// Updated paths to match the subfolders we created
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('reports')
export class ReportsController {
  
  // 1. PUBLIC: Anyone can see general school stats (No Guards)
  @Get('stats')
  getGeneralStats() {
    return { students: 50, lessons: 10 };
  }

  // 2. RESTRICTED: Only teachers can see the secret data
  @Get('teacher-only-data')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher') 
  async getSecretData() {
    return { message: "Success! You are seeing this because you are a Teacher." };
  }

  // 3. RESTRICTED: Only teachers or admins can see student grades
  @Get('student-grades')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher', 'admin') 
  async getGrades() {
    // This logic only runs if the user has 'teacher' or 'admin' role in OracleDB
    return { message: "Class 1A: 85% average" };
  }
}