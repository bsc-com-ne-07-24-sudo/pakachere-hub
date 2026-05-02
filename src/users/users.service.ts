import { Injectable } from '@nestjs/common';
import * as oracledb from 'oracledb';

@Injectable()
export class UsersService {
  
  async registerExam(studentId: string, data: any) {
    let connection;
    try {
      connection = await oracledb.getConnection();
      
      // Generate a mock MANEB Registration Number
      const manebRegNo = `MW-${studentId}-${Math.floor(1000 + Math.random() * 9000)}`;

      const sql = `
        INSERT INTO EXAM_REGISTRATIONS (STUDENT_ID, EXAM_ID, MANEB_REG_NO, STATUS) 
        VALUES (:1, :2, :3, 'PENDING')
      `;

      await connection.execute(sql, [studentId, data.examId, manebRegNo], { autoCommit: true });

      return {
        studentId,
        examId: data.examId,
        manebRegNo,
        status: 'Registered with MANEB'
      };
    } finally {
      if (connection) await connection.close();
    }
  }
}