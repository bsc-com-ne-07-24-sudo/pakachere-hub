import { Injectable } from '@nestjs/common';
import * as oracledb from 'oracledb';

@Injectable()
export class RewardsService {
  
  async getRewardsByStudent(studentId: string) {
    let connection;
    try {
      connection = await oracledb.getConnection();
      
      // We calculate total points from assessments and fetch earned badges
      const sql = `
        SELECT 
          SUM(SCORE) as "totalPoints",
          COUNT(CASE WHEN SCORE >= 80 THEN 1 END) as "badgesEarned"
        FROM PERFORMANCE 
        WHERE STUDENT_ID = :id
      `;

      const result = await connection.execute(
        sql,
        [studentId],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );

      const data: any = result.rows[0];
      
      // Map numerical counts to actual badge names/types for the UI
      return {
        points: data.totalPoints || 0,
        badges: this.calculateBadges(data.badgesEarned || 0),
        nextGoal: "Complete 1 more lesson to earn the 'Scholar' badge!"
      };
    } finally {
      if (connection) await connection.close();
    }
  }

  private calculateBadges(count: number) {
    const badges = [];
    if (count >= 1) badges.push({ name: "Starter", icon: "⭐" });
    if (count >= 5) badges.push({ name: "Achiever", icon: "🏆" });
    if (count >= 10) badges.push({ name: "Pakachere Hero", icon: "🏅" });
    return badges;
  }
}