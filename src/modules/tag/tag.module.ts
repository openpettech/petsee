import { Module } from '@nestjs/common';

import { TagController } from './controllers';
import { TagService } from './services';

@Module({
  imports: [],
  controllers: [TagController],
  providers: [TagService],
  exports: [TagService],
})
export class TagModule {}
