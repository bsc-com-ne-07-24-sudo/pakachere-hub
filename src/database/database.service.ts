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
      console.error('Pool Error:', err);
    }
  }

  async executeQuery(sql: string, binds: any[] = []) {
    let connection;
    try {
      connection = await this.pool.getConnection();
      // Using 4002 (Object) and 2006 (CLOB) directly
      return await connection.execute(sql, binds, { 
        autoCommit: true,
        outFormat: 4002, 
        fetchAsString: [ 2006 ] 
      });
    } catch (err: any) {
      throw err;
    } finally {
      if (connection) await connection.close();
    }
  }

  async onModuleDestroy() {
    if (this.pool) await this.pool.close();
  }
}