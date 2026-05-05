import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { JwtService } from '@nestjs/jwt'; // ADD THIS

@Injectable()
export class AuthService {
  // Inject JwtService into the constructor
  constructor(
    private readonly db: DatabaseService,
    private readonly jwtService: JwtService // ADD THIS
  ) {}

  async validateUser(email: string, pass: string) {
    try {
      const sql = `SELECT USER_ID, EMAIL, PASSWORD, FULLNAME, ROLE, DISABILITY_TYPE FROM USERS WHERE LOWER(TRIM(EMAIL)) = LOWER(TRIM(:1))`;
      const result = await this.db.executeQuery(sql, [email.trim()]);
      
      if (result && result.rows && result.rows.length > 0) {
        const user: any = result.rows[0];
        
        if (user.PASSWORD.toString().trim() === pass.trim()) {
          // Return the full user object so we can sign the token with it
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

  // NEW: This method creates the Token for the student/teacher
  async login(user: any) {
    const payload = { 
      username: user.email, 
      sub: user.userId, 
      role: user.role // Crucial for Role-Based access!
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: user // Sending user info back for the frontend
    };
  }

  async register(userData: any) {
    const { email, password, fullName, disabilityType, role } = userData; 
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
        email.trim().toLowerCase(), 
        password.trim(), 
        fullName, 
        role || 'student', 
        disabilityType || 'None'
      ]);
      
      return { success: true };
    } catch (error) {
      console.error('Registration Error:', error.message);
      throw error;
    }
  }
}