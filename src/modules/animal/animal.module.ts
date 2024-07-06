import { Module } from '@nestjs/common';

import { AnimalService, AnimalRelationshipService } from './services';
import { AnimalController, AnimalRelationshipController } from './controllers';

import {
  CustomFieldModule,
  CustomFieldValueService,
} from '@modules/custom-field';
import { TagModule, TagService } from '@modules/tag';

@Module({
  imports: [CustomFieldModule, TagModule],
  controllers: [AnimalController, AnimalRelationshipController],
  providers: [
    AnimalService,
    AnimalRelationshipService,
    CustomFieldValueService,
    TagService,
  ],
  exports: [AnimalService, AnimalRelationshipService],
})
export class AnimalModule {}
