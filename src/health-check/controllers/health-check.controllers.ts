import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SerializeResponse } from '@aldb2b/common';

@ApiTags('HealthCheck')
@Controller('/health-check')
@SerializeResponse()
export class HealthCheckController {
  constructor() {}

  @Get()
  async getStats(): Promise<object> {
    return { status: 'Healthy' };
  }
}
