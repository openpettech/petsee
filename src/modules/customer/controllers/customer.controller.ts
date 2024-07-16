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
  NotImplementedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import {
  CustomerDto,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  CustomerEntities,
} from '@contracts/customer';
import {
  PageOptionsDto,
  ApiPaginatedResponse,
  Context,
  ServiceRole,
} from '@contracts/common';
import { Ctx, TriggeredBy } from '@shared/decorators';

import { CustomerService } from '../services';
import { SearchService } from '@modules/core';
import { SearchRequestDto } from '@contracts/core';

@ApiTags('Customer')
@Controller('customers')
@UseGuards(AuthGuard('bearer'))
export class CustomerController {
  private readonly logger = new Logger(CustomerController.name);

  constructor(
    private readonly customerService: CustomerService,
    private readonly searchService: SearchService,
  ) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(CustomerDto)
  async list(@Ctx() context: Context, @Query() pageOptionsDto: PageOptionsDto) {
    return this.customerService.findAll(context, pageOptionsDto, {
      projectId: context.projectId,
    });
  }

  @Get('/search')
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(CustomerDto)
  async search(
    @Ctx() context: Context,
    @Query() searchRequestDto: SearchRequestDto,
  ) {
    if (!this.searchService) {
      return new NotImplementedException('Search module not set up');
    }

    return this.searchService.search({
      indexName: CustomerEntities.CUSTOMER,
      projectId: context.projectId,
      ...searchRequestDto,
    });
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: CustomerDto,
  })
  async get(@Ctx() context: Context, @Param('id') id: string) {
    const entry = await this.customerService.findOneById(context, {
      projectId: context.projectId,
      id,
    });
    if (!entry) {
      throw new NotFoundException('Customer not found');
    }

    return entry;
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: CustomerDto,
  })
  async create(
    @Ctx() context: Context,
    @Body()
    createCustomerDto: CreateCustomerRequest,
    @TriggeredBy() triggeredBy: ServiceRole,
  ) {
    return this.customerService.create(context, {
      projectId: context.projectId,
      createdBy: triggeredBy,
      ...createCustomerDto,
    });
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully updated.',
    type: CustomerDto,
  })
  async update(
    @Ctx() context: Context,
    @Body() updateCustomerDto: UpdateCustomerRequest,
    @Param('id') id: string,
    @TriggeredBy() triggeredBy: ServiceRole,
  ) {
    return this.customerService.update(context, {
      id,
      projectId: context.projectId,
      ...updateCustomerDto,
      updatedBy: triggeredBy,
    });
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'The record has been successfully deleted.',
    type: CustomerDto,
  })
  async delete(
    @Ctx() context: Context,
    @Param('id') id: string,
    @TriggeredBy() triggeredBy: ServiceRole,
  ) {
    return this.customerService.delete(context, {
      id,
      projectId: context.projectId,
      deletedBy: triggeredBy,
    });
  }
}
