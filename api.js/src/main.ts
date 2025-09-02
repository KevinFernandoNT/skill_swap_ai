import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:8080', 'http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('SkillSwap API')
    .setDescription('API documentation for SkillSwap')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // Log basic startup info
  console.log('🚀 Starting SkillSwap API Server...');
  console.log('📋 Available endpoints:');
  console.log('   GET  / - Hello endpoint');
  console.log('   GET  /health - Health check');
  console.log('   GET  /test - Test endpoint');
  console.log('   GET  /status - Server status');
  console.log('   GET  /api-docs - Swagger documentation');
  console.log('   POST /auth/login - Login');
  console.log('   POST /auth/register - Register');
  console.log('   GET  /sessions - Get sessions');
  console.log('   POST /sessions - Create session');
  console.log('   ... and more');

  await app.listen(process.env.PORT ?? 3000);
  console.log(`✅ Application is running on: http://localhost:${process.env.PORT ?? 3000}`);
  console.log(`📚 Swagger docs available at: http://localhost:${process.env.PORT ?? 3000}/api-docs`);
  console.log(`🏥 Health check available at: http://localhost:${process.env.PORT ?? 3000}/health`);
}
bootstrap();
