import { Injectable } from '@nestjs/common';

@Injectable()
export class ReportsService {
  // This is the method the controller is looking for
  async getStats() {
    // In a real scenario, you would run SQL queries against your Oracle DB here
    // For the presentation, we return the data required by your project specs
    return {
      totalStudents: 150,
      totalLessons: 45,
      activeUsers: 12,
      topPerformingStudent: "Hawa Salim Malemia",
      systemStatus: "Operational",
      lastBackup: new Date().toISOString(),
    };
  }
}