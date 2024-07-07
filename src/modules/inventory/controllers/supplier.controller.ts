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
  SupplierDto,
  CreateSupplierRequest,
  UpdateSupplierRequest,
} from '@contracts/inventory';
import {
  PageOptionsDto,
  ApiPaginatedResponse,
  Context,
  ServiceRole,
} from '@contracts/common';
import { Ctx, TriggeredBy } from '@shared/decorators';

import { SupplierService } from '../services';

@ApiTags('Inventory')
@Controller('suppliers')
@UseGuards(AuthGuard('bearer'))
export class SupplierController {
  private readonly logger = new Logger(SupplierController.name);

  constructor(private readonly supplierService: SupplierService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(SupplierDto)
  async list(@Ctx() context: Context, @Query() pageOptionsDto: PageOptionsDto) {
    return this.supplierService.findAll(context, pageOptionsDto, {
      projectId: context.projectId,
    });
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: SupplierDto,
  })
  async get(@Ctx() context: Context, @Param('id') id: string) {
    const entry = await this.supplierService.findOneById(context, {
      projectId: context.projectId,
      id,
    });
    if (!entry) {
      throw new NotFoundException('Supplier not found');
    }

    return entry;
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: SupplierDto,
  })
  async create(
    @Ctx() context: Context,
    @Body()
    createSupplierDto: CreateSupplierRequest,
    @TriggeredBy() triggeredBy: ServiceRole,
  ) {
    return this.supplierService.create(context, {
      projectId: context.projectId,
      createdBy: triggeredBy,
      ...createSupplierDto,
    });
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully updated.',
    type: SupplierDto,
  })
  async update(
    @Ctx() context: Context,
    @Body() updateSupplierDto: UpdateSupplierRequest,
    @Param('id') id: string,
    @TriggeredBy() triggeredBy: ServiceRole,
  ) {
    return this.supplierService.update(context, {
      id,
      projectId: context.projectId,
      ...updateSupplierDto,
      updatedBy: triggeredBy,
    });
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'The record has been successfully deleted.',
    type: SupplierDto,
  })
  async delete(
    @Ctx() context: Context,
    @Param('id') id: string,
    @TriggeredBy() triggeredBy: ServiceRole,
  ) {
    return this.supplierService.delete(context, {
      id,
      projectId: context.projectId,
      deletedBy: triggeredBy,
    });
  }
}
