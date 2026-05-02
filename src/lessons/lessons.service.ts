import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class LessonsService {
  constructor(private readonly db: DatabaseService) {}

  async findAll() {
    try {
      const result = await this.db.executeQuery('SELECT * FROM LESSONS');
      
      if (!result || !result.rows) return [];

      // We extract ONLY the primitive values to ensure no hidden objects remain
      const cleanData = result.rows.map((row: any) => {
        return {
          lessonId: Number(row.LESSON_ID),
          title: String(row.TITLE || ''),
          content: String(row.CONTENT_TEXT || ''),
          videoUrl: row.VIDEO_URL ? String(row.VIDEO_URL) : null,
          audioUrl: row.AUDIO_URL ? String(row.AUDIO_URL) : null,
          level: String(row.LESSON_LEVEL || '')
        };
      });

      return cleanData;
    } catch (error: any) {
      // Log only the message, not the whole error object (which is circular)
      console.error('Lessons Service Error:', error.message);
      return [];
    }
  }
}