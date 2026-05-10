import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AssessmentsService {
  constructor(private readonly db: DatabaseService) {}

  // This matches your columns: ASSESSMENT_ID, STUDENT_ID, ANSWERS, SCORE
  async submitScore(studentId: number, assessmentId: number, answers: any) {
    // 1. Logic to calculate score (placeholder for now)
    const score = 85; 
    
    // 2. Convert answers object to string for the CLOB column
    const answersString = JSON.stringify(answers);

    const sql = `
      BEGIN
        INSERT INTO ASSESSMENTS (
          ASSESSMENT_ID, 
          STUDENT_ID, 
          ANSWERS, 
          SCORE, 
          SUBMISSION_DATE
        ) VALUES (:1, :2, :3, :4, CURRENT_TIMESTAMP);
        COMMIT;
      END;
    `;

    await this.db.executeQuery(sql, [
      assessmentId, 
      studentId, 
      answersString, 
      score
    ]);

    return { 
      message: 'Assessment submitted successfully', 
      assessmentId, 
      score, 
      status: 'Passed' 
    };
  }

  async getRecentSubmissions(studentId: number) {
    const sql = `SELECT * FROM ASSESSMENTS WHERE STUDENT_ID = :1 ORDER BY SUBMISSION_DATE DESC`;
    return await this.db.executeQuery(sql, [studentId]);
  }
}