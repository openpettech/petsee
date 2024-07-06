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
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import {
  CustomFieldDto,
  CreateCustomFieldRequest,
  UpdateCustomFieldRequest,
  CustomFieldsFilterDto,
} from '@contracts/custom-field';
import {
  PageOptionsDto,
  ApiPaginatedResponse,
  Context,
} from '@contracts/common';
import { ApiKey, Ctx } from '@shared/decorators';
import { ApiKeyDto } from '@contracts/project';

import { CustomFieldService } from '../services';

@ApiTags('Custom Field')
@Controller('custom-fields')
@UseGuards(AuthGuard('bearer'))
export class CustomFieldController {
  private readonly logger = new Logger(CustomFieldController.name);

  constructor(private readonly customFieldService: CustomFieldService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(CustomFieldDto)
  async list(
    @Ctx() context: Context,
    @Query() pageOptionsDto: PageOptionsDto,
    @Query() customFieldsFilterDto: CustomFieldsFilterDto,
  ) {
    return this.customFieldService.findAll(context, pageOptionsDto, {
      projectId: context.projectId,
      ...customFieldsFilterDto,
    });
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: CustomFieldDto,
  })
  async get(@Ctx() context: Context, @Param('id') id: string) {
    const entry = await this.customFieldService.findOneById(context, {
      projectId: context.projectId,
      id,
    });
    if (!entry) {
      throw new NotFoundException('Custom Field not found');
    }

    return entry;
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: CustomFieldDto,
  })
  async create(
    @Ctx() context: Context,
    @Body()
    createCustomFieldDto: CreateCustomFieldRequest,
    @ApiKey() apiKey: ApiKeyDto,
  ) {
    return this.customFieldService.create(context, {
      projectId: context.projectId,
      createdBy: {
        apiKey: apiKey.id,
      },
      ...createCustomFieldDto,
    });
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully updated.',
    type: CustomFieldDto,
  })
  async update(
    @Ctx() context: Context,
    @Body() updateCustomFieldDto: UpdateCustomFieldRequest,
    @ApiKey() apiKey: ApiKeyDto,
    @Param('id') id: string,
  ) {
    return this.customFieldService.update(context, {
      id,
      projectId: context.projectId,
      ...updateCustomFieldDto,
      updatedBy: {
        apiKey: apiKey.id,
      },
    });
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'The record has been successfully deleted.',
    type: CustomFieldDto,
  })
  async delete(
    @Ctx() context: Context,
    @ApiKey() apiKey: ApiKeyDto,
    @Param('id') id: string,
  ) {
    return this.customFieldService.delete(context, {
      id,
      projectId: context.projectId,
      deletedBy: {
        apiKey: apiKey.id,
      },
    });
  }
}
