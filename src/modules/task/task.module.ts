import { Module } from '@nestjs/common';

import { TaskController } from './controllers';
import { TaskService } from './services';

@Module({
  imports: [],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
