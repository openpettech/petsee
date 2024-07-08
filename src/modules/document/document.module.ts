import { Module } from '@nestjs/common';

import {
  DocumentController,
  DocumentFieldDataController,
  DocumentTemplateController,
  DocumentTemplateFieldController,
  DocumentTemplateFieldOptionController,
} from './controllers';
import {
  DocumentFieldDataService,
  DocumentService,
  DocumentTemplateFieldOptionService,
  DocumentTemplateFieldService,
  DocumentTemplateService,
} from './services';

@Module({
  imports: [],
  controllers: [
    DocumentController,
    DocumentFieldDataController,
    DocumentTemplateController,
    DocumentTemplateFieldController,
    DocumentTemplateFieldOptionController,
  ],
  providers: [
    DocumentFieldDataService,
    DocumentService,
    DocumentTemplateFieldOptionService,
    DocumentTemplateFieldService,
    DocumentTemplateService,
  ],
  exports: [
    DocumentFieldDataService,
    DocumentService,
    DocumentTemplateFieldOptionService,
    DocumentTemplateFieldService,
    DocumentTemplateService,
  ],
})
export class DocumentModule {}
