import { Module } from '@nestjs/common';

import { SearchEventListener } from './listeners';

@Module({
  providers: [SearchEventListener],
})
export class SearchModule {}
