import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly db: DatabaseService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(email: string, pass: string) {
    try {
      const sql = `SELECT USER_ID, EMAIL, PASSWORD, FULLNAME, ROLE, DISABILITY_TYPE FROM USERS WHERE LOWER(TRIM(EMAIL)) = LOWER(TRIM(:1))`;
      
      // result is now the array of rows directly
      const rows: any = await this.db.executeQuery(sql, [email.trim()]);
      
      if (rows && rows.length > 0) {
        const user = rows[0];
        if (user.PASSWORD.toString().trim() === pass.trim()) {
          return {
            userId: user.USER_ID,
            email: user.EMAIL,
            fullName: user.FULLNAME,
            role: user.ROLE,
            disabilityType: user.DISABILITY_TYPE
          };
        }
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  async login(user: any) {
    const payload = { username: user.email, sub: user.userId, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      // Only return specific fields to avoid any hidden circular objects
      user: {
        userId: user.userId,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        disabilityType: user.disabilityType
      }
    };
  }

  async register(userData: any) {
    try {
      const sql = `
        BEGIN 
          INSERT INTO USERS (USER_ID, EMAIL, PASSWORD, FULLNAME, ROLE, DISABILITY_TYPE, LEARNING_LEVEL) 
          VALUES (:1, :2, :3, :4, :5, :6, 'Beginner');
          COMMIT; 
        END;
      `;
      
      await this.db.executeQuery(sql, [
        Math.floor(Date.now()/1000), 
        userData.email.trim().toLowerCase(), 
        userData.password.trim(), 
        userData.fullName, 
        userData.role || 'student', 
        userData.disabilityType || 'None'
      ]);
      
      return { success: true };
    } catch (error) {
      throw new Error('Registration failed: ' + error.message);
    }
  }
}