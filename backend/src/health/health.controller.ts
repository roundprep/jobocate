import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@ApiTags('health')
@Controller()
export class HealthController {
  constructor(@InjectConnection() private connection: Connection) {}

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Server is running and healthy' })
  async health() {
    const health = {
      status: 'ok',
      message: 'Server is running',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      mongodb: this.connection.readyState === 1 ? 'connected' : 'disconnected',
      aiProvider: process.env.AI_PROVIDER || 'openai',
    };

    return health;
  }
}

