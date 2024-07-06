import { Module } from '@nestjs/common';

import { FileController } from './controllers';
import { FileService } from './services';

@Module({
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
