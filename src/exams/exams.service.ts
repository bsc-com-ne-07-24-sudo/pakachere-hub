import { Injectable, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ExamsService {
  constructor(private readonly db: DatabaseService) {}

  async register(userId: number, data: any) {
    const { examType, manebRegNo, examId } = data;

    // 1. Check if the student is already registered for this specific Exam ID
    const checkSql = `SELECT * FROM EXAM_REGISTRATIONS WHERE STUDENT_ID = :1 AND EXAM_ID = :2`;
    const existing: any = await this.db.executeQuery(checkSql, [userId, examId]);

    if (existing && existing.length > 0) {
      throw new BadRequestException('You are already registered for this exam.');
    }

    // 2. Insert the new registration
    const regId = Math.floor(Date.now() / 1000); // Unique ID for REG_ID
    const sql = `
      BEGIN
        INSERT INTO EXAM_REGISTRATIONS (
          REG_ID, STUDENT_ID, EXAM_TYPE, REGISTRATION_DATE, STATUS, MANEB_REG_NO, EXAM_ID
        ) VALUES (:1, :2, :3, CURRENT_TIMESTAMP, 'Pending', :4, :5);
        COMMIT;
      END;
    `;

    await this.db.executeQuery(sql, [
      regId,
      userId,
      examType,
      manebRegNo,
      examId
    ]);

    return { success: true, registrationId: regId };
  }

  async getMyRegistrations(userId: number) {
    const sql = `SELECT * FROM EXAM_REGISTRATIONS WHERE STUDENT_ID = :1 ORDER BY REGISTRATION_DATE DESC`;
    return await this.db.executeQuery(sql, [userId]);
  }
}