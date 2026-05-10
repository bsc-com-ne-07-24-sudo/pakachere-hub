import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class UsersService {
  constructor(private readonly db: DatabaseService) {}

  async registerExam(studentId: string, data: any) {
    try {
      const manebRegNo = `MW-${studentId}-${Math.floor(1000 + Math.random() * 9000)}`;
      const sql = `
        INSERT INTO EXAM_REGISTRATIONS (STUDENT_ID, EXAM_ID, MANEB_REG_NO, STATUS) 
        VALUES (:1, :2, :3, 'PENDING')
      `;

      await this.db.executeQuery(sql, [studentId, data.examId, manebRegNo]);

      return {
        studentId,
        manebRegNo,
        status: 'Registered with MANEB'
      };
    } catch (error) {
      throw new Error('Exam Registration Error: ' + error.message);
    }
  }
}