import { Controller, Post, Body, Res, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import type { Response } from 'express'; 
// 1. Import Swagger Decorators
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Users & Exams') // 2. Groups this under "Users & Exams" in the UI
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post(':id/exams/register')
  // 3. Describe the operation
  @ApiOperation({ summary: 'Register a specific student for an exam' })
  
  // 4. Describe the URL Parameter
  @ApiParam({ name: 'id', description: 'The unique ID of the student (from USERS table)', example: '1' })
  
  // 5. Describe what the Body should look like
  @ApiBody({ 
    schema: {
      type: 'object',
      properties: {
        exam_id: { type: 'number', example: 101 },
        maneb_reg_no: { type: 'string', example: 'M1234/001' }
      }
    }
  })

  // 6. Define possible outcomes
  @ApiResponse({ status: 201, description: 'Successfully registered for the exam.' })
  @ApiResponse({ status: 400, description: 'Invalid identifiers (ORA-00904) or missing data.' })
  @ApiResponse({ status: 404, description: 'Student ID not found.' })
  
  async registerForExam(
    @Param('id') studentId: string,
    @Body() examData: any,
    @Res() res: Response
  ) {
    const result = await this.usersService.registerExam(studentId, examData);
    return res.status(201).json(result);
  }
}