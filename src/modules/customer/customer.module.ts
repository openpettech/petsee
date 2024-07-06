import { Module } from '@nestjs/common';

import { CustomerService, ContactService } from './services';
import { CustomerController, ContactController } from './controllers';

import {
  CustomFieldModule,
  CustomFieldValueService,
} from '@modules/custom-field';
import { TagModule, TagService } from '@modules/tag';
@Module({
  imports: [CustomFieldModule, TagModule],
  controllers: [CustomerController, ContactController],
  providers: [
    CustomerService,
    CustomFieldValueService,
    ContactService,
    TagService,
  ],
  exports: [CustomerService, ContactService],
})
export class CustomerModule {}
