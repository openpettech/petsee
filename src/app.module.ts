import {
  Module,
  Logger,
  Type,
  ForwardReference,
  DynamicModule,
} from '@nestjs/common';
import { ConditionalModule } from '@nestjs/config';
// Modules
import { AnimalModule } from '@modules/animal';
import { AuthModule } from '@modules/auth';
import { CoreModule } from '@modules/core';
import { CommunicationModule } from '@modules/communication';
import { CustomFieldModule } from '@modules/custom-field';
import { CustomerModule } from '@modules/customer';
import { DataLakeModule } from '@modules/data-lake';
import { DictionaryModule } from '@modules/dictionary';
import { FileModule } from '@modules/file';
import { InventoryModule } from '@modules/inventory';
import { HealthModule } from '@modules/health';
import { NoteModule } from '@modules/note';
import { NotificationCenterModule } from '@modules/notification-center';
import { OrganizationModule } from '@modules/organization';
import { ProjectModule } from '@modules/project';
import { ResourceModule } from '@modules/resource';
import { SearchModule } from '@modules/search';
import { ServiceModule } from '@modules/service';
import { TagModule } from '@modules/tag';
import { TaskModule } from '@modules/task';

const modules: Array<
  Type | DynamicModule | Promise<DynamicModule> | ForwardReference
> = [
  AnimalModule,
  AuthModule,
  CoreModule,
  CommunicationModule,
  CustomFieldModule,
  CustomerModule,
  DataLakeModule,
  DictionaryModule,
  FileModule,
  InventoryModule,
  HealthModule,
  NoteModule,
  NotificationCenterModule,
  OrganizationModule,
  ProjectModule,
  ResourceModule,
  ServiceModule,
  TagModule,
  TaskModule,
  ConditionalModule.registerWhen(
    SearchModule,
    (env: NodeJS.ProcessEnv) => !!env['SEARCH_PROVIDER'],
  ),
];

const controllers: any[] = [];

const providers: any[] = [];

@Module({
  imports: modules,
  controllers,
  providers,
})
export class AppModule {
  constructor() {
    Logger.log(`BOOTSTRAPPED NEST APPLICATION`);
  }
}
