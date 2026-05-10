import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as oracledb from 'oracledb';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private pool: oracledb.Pool;

  async onModuleInit() {
    try {
      this.pool = await oracledb.createPool({
        user: 'pakachereweb',
        password: '2004',
        connectString: 'localhost:1521/XEPDB1',
      });
      console.log('Oracle Pool Ready.');
    } catch (err) {
      console.error('Pool Error:', err.message);
    }
  }

  async executeQuery(sql: string, binds: any[] = []) {
    let connection;
    try {
      if (!this.pool) {
        throw new Error('Oracle Pool not initialized');
      }
      connection = await this.pool.getConnection();
      const result = await connection.execute(sql, binds, { 
        autoCommit: true,
        outFormat: 4002, 
        fetchAsString: [ 2006 ] 
      });

      // Sanitization to kill circular references
      if (result.rows) {
        return JSON.parse(JSON.stringify(result.rows)); 
      }
      
      return { success: true }; 

    } catch (err: any) {
      console.error('DATABASE CRASH LOG:', err.message);
      throw new Error(err.message); 
    } finally {
      if (connection) {
        try { await connection.close(); } catch (e) {}
      }
    }
  }

  async onModuleDestroy() {
    if (this.pool) {
      try {
        await this.pool.close();
      } catch (err) {
        console.error('Error closing pool:', err.message);
      }
    }
  }
}