import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ExamsService {
  constructor(private readonly db: DatabaseService) {}

  // --- 1. STUDENT: Register for an exam ---
  async register(userId: number, data: any) {
    const { examType, manebRegNo, examId } = data;

    // Maneb Validation (e.g., M1001/022)
    const manebRegex = /^[A-Z]\d{4}\/\d{3}$/; 
    if (!manebRegex.test(manebRegNo)) {
      throw new BadRequestException('Invalid MANEB Format. Use M1001/022');
    }

    // Capacity Limit
    const countSql = `SELECT COUNT(*) as TOTAL FROM EXAM_REGISTRATIONS WHERE EXAM_ID = :1`;
    const countRes: any = await this.db.executeQuery(countSql, [examId]);
    if (countRes[0] && countRes[0].TOTAL >= 50) {
      throw new ForbiddenException('This exam session is full.');
    }

    // Duplicate Check
    const checkSql = `SELECT * FROM EXAM_REGISTRATIONS WHERE STUDENT_ID = :1 AND EXAM_ID = :2`;
    const existing: any = await this.db.executeQuery(checkSql, [userId, examId]);
    if (existing && existing.length > 0) {
      throw new BadRequestException('Already registered for this exam.');
    }

    const regId = Math.floor(Date.now() / 1000);
    const sql = `
      BEGIN
        INSERT INTO EXAM_REGISTRATIONS (REG_ID, STUDENT_ID, EXAM_TYPE, REGISTRATION_DATE, STATUS, MANEB_REG_NO, EXAM_ID)
        VALUES (:1, :2, :3, CURRENT_TIMESTAMP, 'Pending', :4, :5);
        COMMIT;
      END;
    `;
    await this.db.executeQuery(sql, [regId, userId, examType, manebRegNo, examId]);
    return { success: true, message: 'Registration submitted.' };
  }

  // --- 2. STUDENT: Get their own registrations ---
  // THIS WAS THE MISSING METHOD CAUSING YOUR ERROR
  async getMyRegistrations(userId: number) {
    const sql = `SELECT * FROM EXAM_REGISTRATIONS WHERE STUDENT_ID = :1 ORDER BY REGISTRATION_DATE DESC`;
    return await this.db.executeQuery(sql, [userId]);
  }

  // --- 3. TEACHER: See all pending ---
  async getPending() {
    const sql = `SELECT * FROM EXAM_REGISTRATIONS WHERE STATUS = 'Pending'`;
    return await this.db.executeQuery(sql, []);
  }

  // --- 4. TEACHER: Approve/Reject ---
  async updateStatus(regId: number, status: string) {
    const sql = `
      BEGIN
        UPDATE EXAM_REGISTRATIONS SET STATUS = :1 WHERE REG_ID = :2;
        COMMIT;
      END;
    `;
    await this.db.executeQuery(sql, [status, regId]);
    return { success: true, message: `Status updated to ${status}` };
  }
}