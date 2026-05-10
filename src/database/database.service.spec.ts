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
      connection = await this.pool.getConnection();
      const result = await connection.execute(sql, binds, { 
        autoCommit: true,
        outFormat: 4002, // Object format
        fetchAsString: [ 2006 ] // CLOB as string
      });

      // CRITICAL FIX: If it's a SELECT, return the rows array.
      // If it's an INSERT/UPDATE, return a clean simple object.
      // This prevents the "Circular" metadata from escaping.
      if (result.rows) {
        return result.rows; 
      }
      return { rowsAffected: result.rowsAffected }; 
    } catch (err: any) {
      // Convert the circular error into a simple string
      throw new Error(err.message); 
    } finally {
      if (connection) {
        try { await connection.close(); } catch (e) {}
      }
    }
  }

  async onModuleDestroy() {
    if (this.pool) await this.pool.close();
  }
}