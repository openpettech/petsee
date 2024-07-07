import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Delete,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  Logger,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import {
  CustomFieldValueDto,
  CreateCustomFieldValueRequest,
  UpdateCustomFieldValueRequest,
  CustomFieldValuesFilterDto,
} from '@contracts/custom-field';
import {
  PageOptionsDto,
  ApiPaginatedResponse,
  Context,
  ServiceRole,
} from '@contracts/common';
import { Ctx, TriggeredBy } from '@shared/decorators';

import { CustomFieldValueService } from '../services';

@ApiTags('Custom Field')
@Controller('/custom-field-values')
@UseGuards(AuthGuard('bearer'))
export class CustomFieldValueController {
  private readonly logger = new Logger(CustomFieldValueController.name);

  constructor(
    private readonly customFieldValueService: CustomFieldValueService,
  ) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(CustomFieldValueDto)
  async list(
    @Ctx() context: Context,
    @Query() pageOptionsDto: PageOptionsDto,
    @Query() customFieldValuesFilterDto: CustomFieldValuesFilterDto,
  ) {
    return this.customFieldValueService.findAll(context, pageOptionsDto, {
      projectId: context.projectId,
      ...customFieldValuesFilterDto,
    });
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: CustomFieldValueDto,
  })
  async get(@Ctx() context: Context, @Param('id') id: string) {
    return this.customFieldValueService.findOneById(context, {
      id,
      projectId: context.projectId,
    });
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: CustomFieldValueDto,
  })
  async create(
    @Ctx() context: Context,
    @Body()
    createCustomFieldValueDto: CreateCustomFieldValueRequest,
    @TriggeredBy() triggeredBy: ServiceRole,
  ) {
    return this.customFieldValueService.create(context, {
      projectId: context.projectId,
      createdBy: triggeredBy,
      ...createCustomFieldValueDto,
    });
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully updated.',
    type: CustomFieldValueDto,
  })
  async update(
    @Ctx() context: Context,
    @Body() updateCustomFieldValueDto: UpdateCustomFieldValueRequest,
    @TriggeredBy() triggeredBy: ServiceRole,
    @Param('id') id: string,
  ) {
    return this.customFieldValueService.update(context, {
      id,
      projectId: context.projectId,
      ...updateCustomFieldValueDto,
      updatedBy: triggeredBy,
    });
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'The record has been successfully deleted.',
    type: CustomFieldValueDto,
  })
  async delete(
    @Ctx() context: Context,
    @TriggeredBy() triggeredBy: ServiceRole,
    @Param('id') id: string,
  ) {
    return this.customFieldValueService.delete(context, {
      id,
      projectId: context.projectId,
      deletedBy: triggeredBy,
    });
  }
}
