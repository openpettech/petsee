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
  ResourceTypeDto,
  CreateResourceTypeRequest,
  UpdateResourceTypeRequest,
} from '@contracts/resource';
import {
  PageOptionsDto,
  ApiPaginatedResponse,
  Context,
  ServiceRole,
} from '@contracts/common';
import { Ctx, TriggeredBy } from '@shared/decorators';

import { ResourceTypeService } from '../services';

@ApiTags('Resource')
@Controller('resource-types')
@UseGuards(AuthGuard('bearer'))
export class ResourceTypeController {
  private readonly logger = new Logger(ResourceTypeController.name);

  constructor(private readonly resourceTypeService: ResourceTypeService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(ResourceTypeDto)
  async list(@Ctx() context: Context, @Query() pageOptionsDto: PageOptionsDto) {
    return this.resourceTypeService.findAll(context, pageOptionsDto, {
      projectId: context.projectId,
    });
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: ResourceTypeDto,
  })
  async get(@Ctx() context: Context, @Param('id') id: string) {
    const entry = await this.resourceTypeService.findOneById(context, {
      projectId: context.projectId,
      id,
    });
    if (!entry) {
      throw new NotFoundException('ResourceType not found');
    }

    return entry;
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: ResourceTypeDto,
  })
  async create(
    @Ctx() context: Context,
    @Body()
    createResourceTypeDto: CreateResourceTypeRequest,
    @TriggeredBy() triggeredBy: ServiceRole,
  ) {
    return this.resourceTypeService.create(context, {
      projectId: context.projectId,
      createdBy: triggeredBy,
      ...createResourceTypeDto,
    });
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully updated.',
    type: ResourceTypeDto,
  })
  async update(
    @Ctx() context: Context,
    @Body() updateResourceTypeDto: UpdateResourceTypeRequest,
    @Param('id') id: string,
    @TriggeredBy() triggeredBy: ServiceRole,
  ) {
    return this.resourceTypeService.update(context, {
      id,
      projectId: context.projectId,
      ...updateResourceTypeDto,
      updatedBy: triggeredBy,
    });
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'The record has been successfully deleted.',
    type: ResourceTypeDto,
  })
  async delete(
    @Ctx() context: Context,
    @Param('id') id: string,
    @TriggeredBy() triggeredBy: ServiceRole,
  ) {
    return this.resourceTypeService.delete(context, {
      id,
      projectId: context.projectId,
      deletedBy: triggeredBy,
    });
  }
}
