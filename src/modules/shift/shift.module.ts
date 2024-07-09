import { Module } from '@nestjs/common';

import { ShiftController, ShiftTypeController } from './controllers';
import { ShiftService, ShiftTypeService } from './services';

@Module({
  imports: [],
  controllers: [ShiftController, ShiftTypeController],
  providers: [ShiftService, ShiftTypeService],
  exports: [ShiftService, ShiftTypeService],
})
export class ShiftModule {}
