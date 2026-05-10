import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class LessonsService {
  constructor(private readonly db: DatabaseService) {}

  async findAll() {
    try {
      const sql = `SELECT ID, TITLE, CONTENT, AUDIOURL FROM LESSONS`;
      // result is now already the clean array of rows
      const result = await this.db.executeQuery(sql, []);
      return result; 
    } catch (error) {
      throw new Error('Could not fetch lessons: ' + error.message);
    }
  }

  async create(data: any) {
    try {
      const id = Math.floor(Date.now() / 1000);
      const sql = `
        BEGIN 
          INSERT INTO LESSONS (ID, TITLE, CONTENT, AUDIOURL) 
          VALUES (:1, :2, :3, :4);
          COMMIT; 
        END;
      `;
      await this.db.executeQuery(sql, [id, data.title, data.content, data.audioUrl]);
      return { id, title: data.title };
    } catch (error) {
      throw new Error('Could not create lesson: ' + error.message);
    }
  }
  // For Students: Only see approved content
async findApproved() {
  const sql = `SELECT * FROM LESSONS WHERE STATUS = 'Approved' ORDER BY ID DESC`;
  return await this.db.executeQuery(sql);
}

// For Admins: See everything that needs a review
async findPending() {
  const sql = `SELECT * FROM LESSONS WHERE STATUS = 'Pending' ORDER BY ID DESC`;
  return await this.db.executeQuery(sql);
}

// The Approval Action
async updateLessonStatus(lessonId: number, status: string) {
  const sql = `
    BEGIN
      UPDATE LESSONS SET STATUS = :1 WHERE ID = :2;
      COMMIT;
    END;
  `;
  return await this.db.executeQuery(sql, [status, lessonId]);
}
}