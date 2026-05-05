import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  // 1. CREATE the app first (This MUST come before Swagger)
  const app = await NestFactory.create(AppModule);

  // 2. CONFIGURE Swagger
  const config = new DocumentBuilder()
    .setTitle('Pakachere School Portal')
    .setDescription('API for student registrations and lessons')
    .setVersion('1.0')
    .addTag('users')
    .addTag('auth')
    .build();

  // 3. SETUP Swagger using the 'app' we just created
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // 4. OTHER settings
  app.enableCors();

  // 5. START the server
  await app.listen(3000);
  
  console.log(`Backend is running on: http://localhost:3000`);
  console.log(`Swagger Docs available at: http://localhost:3000/api/docs`);
}

bootstrap();