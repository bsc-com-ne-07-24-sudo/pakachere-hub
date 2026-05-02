import { Injectable } from '@nestjs/common';
import * as oracledb from 'oracledb';

@Injectable()
export class LessonsService {
  
  async findAll() {
    let connection;
    try {
      connection = await oracledb.getConnection();
      // We explicitly alias columns to match what the frontend expects
      const result = await connection.execute(
        `SELECT ID, TITLE, CONTENT, AUDIOURL FROM LESSONS`,
        [],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      return result.rows;
    } catch (err) {
      throw err;
    } finally {
      if (connection) await connection.close();
    }
  }

  async create(data: any) {
    let connection;
    try {
      connection = await oracledb.getConnection();
      const sql = `INSERT INTO LESSONS (TITLE, CONTENT, AUDIOURL) VALUES (:1, :2, :3)`;
      const binds = [data.title, data.content, data.audioUrl];
      
      await connection.execute(sql, binds, { autoCommit: true });
      return { title: data.title };
    } catch (err) {
      throw err;
    } finally {
      if (connection) await connection.close();
    }
  }
}