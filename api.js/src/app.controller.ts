import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    this.logger.log('Hello endpoint called');
    return this.appService.getHello();
  }

  @Get('health')
  getHealth(): { status: string; timestamp: string } {
    this.logger.log('Health endpoint called');
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('test')
  getTest(): { message: string; timestamp: string; endpoints: string[] } {
    this.logger.log('Test endpoint called');
    return {
      message: 'AppController is working!',
      timestamp: new Date().toISOString(),
      endpoints: ['/', '/health', '/test']
    };
  }

  @Get('status')
  getStatus(): { 
    status: string; 
    timestamp: string; 
    uptime: number;
    environment: string;
    version: string;
  } {
    this.logger.log('Status endpoint called');
    return {
      status: 'running',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0'
    };
  }
}
