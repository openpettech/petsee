import { Module, Global } from '@nestjs/common';

import { DataLakeEventListener } from './listeners';

@Global()
@Module({
  providers: [DataLakeEventListener],
  exports: [],
})
export class DataLakeModule {}
