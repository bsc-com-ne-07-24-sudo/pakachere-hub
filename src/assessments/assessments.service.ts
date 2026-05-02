import { Injectable } from '@nestjs/common';
import * as oracledb from 'oracledb';

@Injectable()
export class AssessmentsService {
  
  async createAssessment(data: any) {
    let conn;
    try {
      conn = await oracledb.getConnection();
      // Insert into a QUIZZES table
      await conn.execute(
        `INSERT INTO QUIZZES (TITLE, QUESTIONS, LESSON_ID) VALUES (:1, :2, :3)`,
        [data.title, JSON.stringify(data.questions), data.lessonId],
        { autoCommit: true }
      );
      return { status: 'success' };
    } finally { if (conn) await conn.close(); }
  }

  async submitAnswers(studentId: string, quizId: string, submission: any) {
    let conn;
    try {
      conn = await oracledb.getConnection();
      // Logic to save the student's score in a PERFORMANCE table
      const score = 80; // Placeholder: You would normally calculate this against correct answers
      await conn.execute(
        `INSERT INTO PERFORMANCE (STUDENT_ID, QUIZ_ID, SCORE) VALUES (:1, :2, :3)`,
        [studentId, quizId, score],
        { autoCommit: true }
      );
      return score;
    } finally { if (conn) await conn.close(); }
  }
}