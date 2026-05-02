import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AuthService {
  constructor(private readonly db: DatabaseService) {}

  async validateUser(email: string, pass: string) {
    try {
      // 1. ADDED DISABILITY_TYPE to the SELECT so the frontend can display it
      const sql = `SELECT USER_ID, EMAIL, PASSWORD, FULLNAME, ROLE, DISABILITY_TYPE FROM USERS WHERE LOWER(TRIM(EMAIL)) = LOWER(TRIM(:1))`;
      const result = await this.db.executeQuery(sql, [email.trim()]);
      
      if (result && result.rows && result.rows.length > 0) {
        const user: any = result.rows[0];
        
        if (user.PASSWORD.toString().trim() === pass.trim()) {
          return {
            userId: user.USER_ID,
            email: user.EMAIL,
            fullName: user.FULLNAME,
            role: user.ROLE,
            disabilityType: user.DISABILITY_TYPE // Now correctly returned to frontend
          };
        }
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  async register(userData: any) {
    // 2. EXTRACT 'role' from userData (passed from our new Auth.jsx dropdown)
    const { email, password, fullName, disabilityType, role } = userData; 
    
    try {
      const sql = `
        BEGIN 
          INSERT INTO USERS (USER_ID, EMAIL, PASSWORD, FULLNAME, ROLE, DISABILITY_TYPE, LEARNING_LEVEL) 
          VALUES (:1, :2, :3, :4, :5, :6, 'Beginner');
          COMMIT; 
        END;
      `;
      
      // 3. UPDATED BIND PARAMETERS: :5 is now 'role' and :6 is 'disabilityType'
      await this.db.executeQuery(sql, [
        Math.floor(Date.now()/1000), 
        email.trim().toLowerCase(), 
        password.trim(), 
        fullName, 
        role || 'student', // Uses selected role or defaults to student
        disabilityType || 'None'
      ]);
      
      return { success: true };
    } catch (error) {
      console.error('Registration Error:', error.message);
      throw error;
    }
  }
}