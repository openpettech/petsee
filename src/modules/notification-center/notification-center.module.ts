import { Module } from '@nestjs/common';

import { NotificationCenterController } from './controllers';
import { NotificationCenterService } from './services';

@Module({
  imports: [],
  controllers: [NotificationCenterController],
  providers: [NotificationCenterService],
  exports: [NotificationCenterService],
})
export class NotificationCenterModule {}
