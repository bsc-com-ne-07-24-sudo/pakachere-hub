import { Injectable } from '@nestjs/common';
import * as oracledb from 'oracledb';

@Injectable()
export class ReportsService {
  
  async generateOverview() {
    let connection;
    try {
      connection = await oracledb.getConnection();
      
      // Query 1: Total Users grouped by Disability Type (for inclusivity tracking)
      const userStats = await connection.execute(
        `SELECT DISABILITY_TYPE, COUNT(*) as COUNT FROM USERS GROUP BY DISABILITY_TYPE`,
        [], { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );

      // Query 2: Performance average per Lesson
      const performanceStats = await connection.execute(
        `SELECT l.TITLE, AVG(p.SCORE) as AVG_SCORE 
         FROM LESSONS l 
         JOIN PERFORMANCE p ON l.ID = p.LESSON_ID 
         GROUP BY l.TITLE`,
        [], { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );

      return {
        userDistribution: userStats.rows,
        lessonPerformance: performanceStats.rows,
        totalManebRegistrations: await this.getManebCount(connection)
      };
    } finally {
      if (connection) await connection.close();
    }
  }

  private async getManebCount(conn: any) {
    const result = await conn.execute(`SELECT COUNT(*) as TOTAL FROM EXAM_REGISTRATIONS`);
    return result.rows[0][0];
  }
}