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
  Logger,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CustomFieldType } from '@prisma/client';

import {
  CustomFieldOptionDto,
  CreateCustomFieldOptionRequest,
  UpdateCustomFieldOptionRequest,
  CustomFieldOptionsFilterDto,
} from '@contracts/custom-field';
import {
  PageOptionsDto,
  ApiPaginatedResponse,
  Context,
  ServiceRole,
} from '@contracts/common';
import { Ctx, TriggeredBy } from '@shared/decorators';

import { CustomFieldOptionService, CustomFieldService } from '../services';

@ApiTags('Custom Field')
@Controller('custom-field-options')
@UseGuards(AuthGuard('bearer'))
export class CustomFieldOptionController {
  private readonly logger = new Logger(CustomFieldOptionController.name);

  constructor(
    private readonly customFieldService: CustomFieldService,
    private readonly customFieldOptionService: CustomFieldOptionService,
  ) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(CustomFieldOptionDto)
  async list(
    @Ctx() context: Context,
    @Query() pageOptionsDto: PageOptionsDto,
    @Query() customFieldOptionsFilterDto: CustomFieldOptionsFilterDto,
  ) {
    return this.customFieldOptionService.findAll(context, pageOptionsDto, {
      projectId: context.projectId,
      ...customFieldOptionsFilterDto,
    });
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: CustomFieldOptionDto,
  })
  async get(@Ctx() context: Context, @Param('id') id: string) {
    const entry = await this.customFieldOptionService.findOneById(context, {
      projectId: context.projectId,
      id,
    });
    if (!entry) {
      throw new NotFoundException('Custom Field Option not found');
    }

    return entry;
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: CustomFieldOptionDto,
  })
  async create(
    @Ctx() context: Context,
    @Body()
    createCustomFieldOptionDto: CreateCustomFieldOptionRequest,
    @TriggeredBy() triggeredBy: ServiceRole,
  ) {
    const customField = await this.customFieldService.findOneById(context, {
      projectId: context.projectId,
      id: createCustomFieldOptionDto.customFieldId,
    });
    if (!customField) {
      throw new NotFoundException('Custom Field not found');
    }

    const excludedTypes: CustomFieldType[] = [
      CustomFieldType.DATE,
      CustomFieldType.JSON,
      CustomFieldType.LONG_TEXT,
      CustomFieldType.SHORT_TEXT,
      CustomFieldType.SINGLE_CHECKBOX,
      CustomFieldType.NUMBER,
    ];
    if (excludedTypes.includes(customField.type)) {
      throw new BadRequestException('Custom Field does not support options');
    }

    return this.customFieldOptionService.create(context, {
      ...createCustomFieldOptionDto,
      projectId: context.projectId,
      createdBy: triggeredBy,
    });
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully updated.',
    type: CustomFieldOptionDto,
  })
  async update(
    @Ctx() context: Context,
    @Body() updateCustomFieldOptionDto: UpdateCustomFieldOptionRequest,
    @TriggeredBy() triggeredBy: ServiceRole,
    @Param('id') id: string,
  ) {
    return this.customFieldService.update(context, {
      id,
      projectId: context.projectId,
      ...updateCustomFieldOptionDto,
      updatedBy: triggeredBy,
    });
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'The record has been successfully deleted.',
    type: CustomFieldOptionDto,
  })
  async delete(
    @Ctx() context: Context,
    @TriggeredBy() triggeredBy: ServiceRole,
    @Param('id') id: string,
  ) {
    return this.customFieldService.delete(context, {
      id,
      projectId: context.projectId,
      deletedBy: triggeredBy,
    });
  }
}
