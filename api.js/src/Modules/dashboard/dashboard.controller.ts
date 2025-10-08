import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('data')
  async getDashboardData(@Request() req) {
    console.log('Dashboard Controller - Request user:', req.user);
    console.log('Dashboard Controller - User ID:', req.user?._id);
    const userId = req.user?._id;
    return await this.dashboardService.getDashboardData(userId);
  }
}
