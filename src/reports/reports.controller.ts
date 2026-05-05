import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('reports')
export class ReportsController {
  
  @Get('teacher-only-data')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('teacher') // <--- Only users with 'teacher' in the database can enter
async getSecretData() {
  return { message: "Success! You are seeing this because you are a Teacher." };
}

  // 1. PUBLIC: Anyone can see general school stats
  @Get('stats')
  getGeneralStats() {
    return { students: 50, lessons: 10 };
  }

  // 2. RESTRICTED: Only teachers can see private student grades
  @UseGuards(JwtAuthGuard, RolesGuard) // Turn on the bouncer
  @Roles('teacher', 'admin')           // Check the ID badge
  @Get('student-grades')
  async getGrades() {
    // This logic only runs if the user has 'teacher' role in OracleDB
    return { message: "Class 1A: 85% average" };
  }
}