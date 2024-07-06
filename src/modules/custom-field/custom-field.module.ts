import { Module } from '@nestjs/common';

import {
  CustomFieldService,
  CustomFieldOptionService,
  CustomFieldValueService,
} from './services';
import {
  CustomFieldController,
  CustomFieldOptionController,
  CustomFieldValueController,
} from './controllers';

@Module({
  imports: [],
  controllers: [
    CustomFieldController,
    CustomFieldOptionController,
    CustomFieldValueController,
  ],
  providers: [
    CustomFieldService,
    CustomFieldOptionService,
    CustomFieldValueService,
  ],
  exports: [
    CustomFieldService,
    CustomFieldOptionService,
    CustomFieldValueService,
  ],
})
export class CustomFieldModule {}
