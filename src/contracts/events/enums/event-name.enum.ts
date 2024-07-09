import { AnimalEvents } from '@contracts/animal';
import { CommunicationEvents } from '@contracts/communication';
import { CustomerEvents } from '@contracts/customer';
import { CustomFieldEvents } from '@contracts/custom-field';
import { DictionaryEvents } from '@contracts/dictionary';
import { DocumentEvents } from '@contracts/document';
import { FileEvents } from '@contracts/file';
import { InventoryEvents } from '@contracts/inventory';
import { LocationEvents } from '@contracts/location';
import { NoteEvents } from '@contracts/note';
import { NotificationCenterEvents } from '@contracts/notification-center';
import { OrganizationEvents } from '@contracts/organization';
import { ProjectEvents } from '@contracts/project';
import { ResourceEvents } from '@contracts/resource';
import { TaskEvents } from '@contracts/task';
import { TagEvents } from '@contracts/tag';
import { ServiceEvents } from '@contracts/service';

export type EventNames =
  | AnimalEvents
  | CommunicationEvents
  | CustomerEvents
  | CustomFieldEvents
  | DictionaryEvents
  | DocumentEvents
  | FileEvents
  | InventoryEvents
  | LocationEvents
  | NoteEvents
  | NotificationCenterEvents
  | OrganizationEvents
  | ProjectEvents
  | ResourceEvents
  | TaskEvents
  | TagEvents
  | ServiceEvents;
