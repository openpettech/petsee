import { Module } from '@nestjs/common';

import { ServiceController, ServiceOverrideController } from './controllers';
import { ServiceService, ServiceOverrideService } from './services';

@Module({
  imports: [],
  controllers: [ServiceController, ServiceOverrideController],
  providers: [ServiceService, ServiceOverrideService],
  exports: [ServiceService, ServiceOverrideService],
})
export class ServiceModule {}
