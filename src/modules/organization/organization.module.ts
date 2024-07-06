import { Module } from '@nestjs/common';

import {
  FacilityController,
  GroupController,
  GroupAssociationController,
  MerchantController,
  MerchantAssociationController,
  PersonController,
} from './controllers';
import {
  FacilityService,
  GroupService,
  GroupAssociationService,
  MerchantService,
  MerchantAssociationService,
  PersonService,
} from './services';

import {
  CustomFieldModule,
  CustomFieldValueService,
} from '@modules/custom-field';

@Module({
  imports: [CustomFieldModule],
  controllers: [
    FacilityController,
    GroupController,
    GroupAssociationController,
    MerchantController,
    MerchantAssociationController,
    PersonController,
  ],
  providers: [
    CustomFieldValueService,
    FacilityService,
    GroupService,
    GroupAssociationService,
    MerchantService,
    MerchantAssociationService,
    PersonService,
  ],
  exports: [
    FacilityService,
    GroupService,
    GroupAssociationService,
    MerchantService,
    MerchantAssociationService,
    PersonService,
  ],
})
export class OrganizationModule {}
