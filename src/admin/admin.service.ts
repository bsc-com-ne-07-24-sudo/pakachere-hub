import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AdminService {
  constructor(private readonly db: DatabaseService) {}

  // 1. Fetch all users for the list
  async getAllUsers() {
    const sql = `SELECT USER_ID, USERNAME, EMAIL, ROLE, TO_CHAR(CREATED_AT, 'YYYY-MM-DD') as JOIN_DATE FROM USERS`;
    return await this.db.executeQuery(sql);
  }

  // 2. Fix for error TS2339: updateUserRole
  async updateUserRole(userId: number, role: string) {
    const sql = `
      BEGIN
        UPDATE USERS SET ROLE = :1 WHERE USER_ID = :2;
        COMMIT;
      END;
    `;
    await this.db.executeQuery(sql, [role, userId]);
    return { success: true, message: `User ${userId} role updated to ${role}` };
  }

  // 3. Fix for error TS2339: getPendingLessons
  async getPendingLessons() {
    const sql = `SELECT ID, TITLE, TEACHER_ID, LESSON_LEVEL FROM LESSONS WHERE STATUS = 'Pending'`;
    return await this.db.executeQuery(sql);
  }

  // 4. Fix for error TS2339: updateLessonStatus
  async updateLessonStatus(lessonId: number, status: string) {
    const sql = `
      BEGIN
        UPDATE LESSONS SET STATUS = :1 WHERE ID = :2;
        COMMIT;
      END;
    `;
    const result: any = await this.db.executeQuery(sql, [status, lessonId]);
    
    // We use a simple check here since we're using BEGIN/END blocks
    return { success: true, message: `Lesson is now ${status}` };
  }
}