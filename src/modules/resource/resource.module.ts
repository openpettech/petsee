import { Module } from '@nestjs/common';

import { ResourceController, ResourceTypeController } from './controllers';
import { ResourceService, ResourceTypeService } from './services';

@Module({
  imports: [],
  controllers: [ResourceController, ResourceTypeController],
  providers: [ResourceService, ResourceTypeService],
  exports: [ResourceService, ResourceTypeService],
})
export class ResourceModule {}
