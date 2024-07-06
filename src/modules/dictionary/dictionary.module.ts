import { Module } from '@nestjs/common';

import {
  BreedTranslationService,
  SpeciesTranslationService,
  DiagnoseTranslationService,
  BloodGroupTranslationService,
  AllergenTranslationService,
  ReferenceCategoryTranslationService,
  ReferenceValueService,
  ReferenceValueTranslationService,
} from './services';
import { DictionaryController } from './controllers';

const providers = [
  SpeciesTranslationService,
  BreedTranslationService,
  DiagnoseTranslationService,
  BloodGroupTranslationService,
  AllergenTranslationService,
  ReferenceCategoryTranslationService,
  ReferenceValueService,
  ReferenceValueTranslationService,
];

@Module({
  imports: [],
  controllers: [DictionaryController],
  providers,
  exports: [...providers],
})
export class DictionaryModule {}
