import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // Create the NestJS application instance
  const app = await NestFactory.create(AppModule);

  // 1. Enable CORS: This allows your React frontend (on port 5173) 
  // to securely make requests to this backend (on port 3000).
  app.enableCors();

  // 2. Start the server on port 3000
  await app.listen(3000);
  
  console.log(`Backend is running on: http://localhost:3000`);
  console.log(`Accepting requests from Frontend...`);
}

bootstrap();