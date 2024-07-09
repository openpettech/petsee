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
  ShiftDto,
  CreateShiftRequest,
  UpdateShiftRequest,
} from '@contracts/shift';
import {
  PageOptionsDto,
  ApiPaginatedResponse,
  Context,
  ServiceRole,
} from '@contracts/common';
import { Ctx, TriggeredBy } from '@shared/decorators';

import { ShiftService } from '../services';

@ApiTags('Shift')
@Controller('shifts')
@UseGuards(AuthGuard('bearer'))
export class ShiftController {
  private readonly logger = new Logger(ShiftController.name);

  constructor(private readonly shiftService: ShiftService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(ShiftDto)
  async list(@Ctx() context: Context, @Query() pageOptionsDto: PageOptionsDto) {
    return this.shiftService.findAll(context, pageOptionsDto, {
      projectId: context.projectId,
    });
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: ShiftDto,
  })
  async get(@Ctx() context: Context, @Param('id') id: string) {
    const entry = await this.shiftService.findOneById(context, {
      projectId: context.projectId,
      id,
    });
    if (!entry) {
      throw new NotFoundException('Shift not found');
    }

    return entry;
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: ShiftDto,
  })
  async create(
    @Ctx() context: Context,
    @Body()
    createShiftDto: CreateShiftRequest,
    @TriggeredBy() triggeredBy: ServiceRole,
  ) {
    return this.shiftService.create(context, {
      projectId: context.projectId,
      createdBy: triggeredBy,
      ...createShiftDto,
    });
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully updated.',
    type: ShiftDto,
  })
  async update(
    @Ctx() context: Context,
    @Body() updateShiftDto: UpdateShiftRequest,
    @Param('id') id: string,
    @TriggeredBy() triggeredBy: ServiceRole,
  ) {
    return this.shiftService.update(context, {
      id,
      projectId: context.projectId,
      ...updateShiftDto,
      updatedBy: triggeredBy,
    });
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'The record has been successfully deleted.',
    type: ShiftDto,
  })
  async delete(
    @Ctx() context: Context,
    @Param('id') id: string,
    @TriggeredBy() triggeredBy: ServiceRole,
  ) {
    return this.shiftService.delete(context, {
      id,
      projectId: context.projectId,
      deletedBy: triggeredBy,
    });
  }
}
