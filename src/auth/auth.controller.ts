import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Authenticate user and return a JWT Token' })
  @ApiBody({ 
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'hawah@pakachere.com' },
        password: { type: 'string', example: 'securePassword2027' }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Successfully authenticated. Returns access_token.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  async login(@Body() body: any) {
    // 1. Validate the user credentials against OracleDB
    const user = await this.authService.validateUser(body.email, body.password);
    
    if (!user) {
      throw new HttpException('Invalid email or password', HttpStatus.UNAUTHORIZED);
    }

    // 2. NEW: Generate and return the JWT Token
    // This calls the login(user) method you just added to AuthService
    return this.authService.login(user); 
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user with a specific role' })
  @ApiResponse({ status: 201, description: 'User created successfully.' })
  async register(@Body() userData: any) {
    try {
      return await this.authService.register(userData);
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Registration failed', 
        HttpStatus.BAD_REQUEST
      );
    }  
  }
}