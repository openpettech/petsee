import { Module } from '@nestjs/common';

import { NoteController } from './controllers';
import { NoteService } from './services';

@Module({
  imports: [],
  controllers: [NoteController],
  providers: [NoteService],
  exports: [NoteService],
})
export class NoteModule {}
