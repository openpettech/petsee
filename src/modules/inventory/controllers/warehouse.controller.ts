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
  WarehouseDto,
  CreateWarehouseRequest,
  UpdateWarehouseRequest,
} from '@contracts/inventory';
import {
  PageOptionsDto,
  ApiPaginatedResponse,
  Context,
  ServiceRole,
} from '@contracts/common';
import { Ctx, TriggeredBy } from '@shared/decorators';

import { WarehouseService } from '../services';

@ApiTags('Inventory')
@Controller('warehouses')
@UseGuards(AuthGuard('bearer'))
export class WarehouseController {
  private readonly logger = new Logger(WarehouseController.name);

  constructor(private readonly warehouseService: WarehouseService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(WarehouseDto)
  async list(@Ctx() context: Context, @Query() pageOptionsDto: PageOptionsDto) {
    return this.warehouseService.findAll(context, pageOptionsDto, {
      projectId: context.projectId,
    });
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: WarehouseDto,
  })
  async get(@Ctx() context: Context, @Param('id') id: string) {
    const entry = await this.warehouseService.findOneById(context, {
      projectId: context.projectId,
      id,
    });
    if (!entry) {
      throw new NotFoundException('Warehouse not found');
    }

    return entry;
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: WarehouseDto,
  })
  async create(
    @Ctx() context: Context,
    @Body()
    createWarehouseDto: CreateWarehouseRequest,
    @TriggeredBy() triggeredBy: ServiceRole,
  ) {
    return this.warehouseService.create(context, {
      projectId: context.projectId,
      createdBy: triggeredBy,
      ...createWarehouseDto,
    });
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully updated.',
    type: WarehouseDto,
  })
  async update(
    @Ctx() context: Context,
    @Body() updateWarehouseDto: UpdateWarehouseRequest,
    @Param('id') id: string,
    @TriggeredBy() triggeredBy: ServiceRole,
  ) {
    return this.warehouseService.update(context, {
      id,
      projectId: context.projectId,
      ...updateWarehouseDto,
      updatedBy: triggeredBy,
    });
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'The record has been successfully deleted.',
    type: WarehouseDto,
  })
  async delete(
    @Ctx() context: Context,
    @Param('id') id: string,
    @TriggeredBy() triggeredBy: ServiceRole,
  ) {
    return this.warehouseService.delete(context, {
      id,
      projectId: context.projectId,
      deletedBy: triggeredBy,
    });
  }
}
