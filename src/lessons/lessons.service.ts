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
}