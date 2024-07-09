import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Delete,
  Param,
  NotFoundException,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import {
  ShiftTypeDto,
  CreateShiftTypeRequest,
  UpdateShiftTypeRequest,
} from '@contracts/shift';
import {
  PageOptionsDto,
  ApiPaginatedResponse,
  Context,
  ServiceRole,
} from '@contracts/common';
import { Ctx, TriggeredBy } from '@shared/decorators';

import { ShiftTypeService } from '../services';

@ApiTags('Shift')
@Controller('shift-types')
@UseGuards(AuthGuard('bearer'))
export class ShiftTypeController {
  private readonly logger = new Logger(ShiftTypeController.name);

  constructor(private readonly shiftTypeService: ShiftTypeService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(ShiftTypeDto)
  async list(@Ctx() context: Context, @Query() pageOptionsDto: PageOptionsDto) {
    return this.shiftTypeService.findAll(context, pageOptionsDto, {
      projectId: context.projectId,
    });
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: ShiftTypeDto,
  })
  async get(@Ctx() context: Context, @Param('id') id: string) {
    const entry = await this.shiftTypeService.findOneById(context, {
      projectId: context.projectId,
      id,
    });
    if (!entry) {
      throw new NotFoundException('ShiftType not found');
    }

    return entry;
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: ShiftTypeDto,
  })
  async create(
    @Ctx() context: Context,
    @Body()
    createShiftTypeDto: CreateShiftTypeRequest,
    @TriggeredBy() triggeredBy: ServiceRole,
  ) {
    return this.shiftTypeService.create(context, {
      projectId: context.projectId,
      createdBy: triggeredBy,
      ...createShiftTypeDto,
    });
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully updated.',
    type: ShiftTypeDto,
  })
  async update(
    @Ctx() context: Context,
    @Body() updateShiftTypeDto: UpdateShiftTypeRequest,
    @Param('id') id: string,
    @TriggeredBy() triggeredBy: ServiceRole,
  ) {
    return this.shiftTypeService.update(context, {
      id,
      projectId: context.projectId,
      ...updateShiftTypeDto,
      updatedBy: triggeredBy,
    });
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'The record has been successfully deleted.',
    type: ShiftTypeDto,
  })
  async delete(
    @Ctx() context: Context,
    @Param('id') id: string,
    @TriggeredBy() triggeredBy: ServiceRole,
  ) {
    return this.shiftTypeService.delete(context, {
      id,
      projectId: context.projectId,
      deletedBy: triggeredBy,
    });
  }
}
