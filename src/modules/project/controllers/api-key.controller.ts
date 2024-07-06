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
} from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import {
  ApiKeyDto,
  CreateApiKeyRequest,
  UpdateApiKeyRequest,
} from '@contracts/project';
import {
  PageOptionsDto,
  ApiPaginatedResponse,
  Context,
} from '@contracts/common';
import { Auth0UserDto } from '@contracts/auth';
import { Ctx, CurrentUser } from '@shared/decorators';

import { ApiKeyService, ProjectService } from '../services';

@ApiTags('Project')
@Controller('projects/:projectId/api-keys')
@UseGuards(AuthGuard('Auth0'))
export class ApiKeyController {
  private readonly logger = new Logger(ApiKeyController.name);

  constructor(
    private readonly apiKeyService: ApiKeyService,
    private readonly projectService: ProjectService,
  ) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(ApiKeyDto)
  async list(
    @Query() pageOptionsDto: PageOptionsDto,
    @Ctx() context: Context,
    @Param('projectId') projectId: string,
  ) {
    const project = await this.projectService.findOneById(context, projectId);
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return this.apiKeyService.findAll(context, pageOptionsDto, {
      projectId,
    });
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: ApiKeyDto,
  })
  async get(
    @Param('id') id: string,
    @Ctx() context: Context,
    @Param('projectId') projectId: string,
  ) {
    const project = await this.projectService.findOneById(context, projectId);
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const entry = await this.apiKeyService.findOneById(context, projectId, id);
    if (!entry) {
      throw new NotFoundException('Api Key not found');
    }

    return entry;
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: ApiKeyDto,
  })
  async create(
    @Body()
    createApiKeyDto: CreateApiKeyRequest,
    @Ctx() context: Context,
    @CurrentUser() user: Auth0UserDto,
    @Param('projectId') projectId: string,
  ) {
    const project = await this.projectService.findOneById(context, projectId);
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return this.apiKeyService.create(context, {
      projectId,
      createdBy: {
        user: user.id,
      },
      ...createApiKeyDto,
    });
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully updated.',
    type: ApiKeyDto,
  })
  async update(
    @Body() updateApiKeyDto: UpdateApiKeyRequest,
    @Ctx() context: Context,
    @CurrentUser() user: Auth0UserDto,
    @Param('id') id: string,
    @Param('projectId') projectId: string,
  ) {
    const project = await this.projectService.findOneById(context, projectId);
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return this.apiKeyService.update(context, {
      id,
      projectId,
      ...updateApiKeyDto,
      updatedBy: {
        user: user.id,
      },
    });
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'The record has been successfully deleted.',
    type: ApiKeyDto,
  })
  async delete(
    @Ctx() context: Context,
    @CurrentUser() user: Auth0UserDto,
    @Param('id') id: string,
    @Param('projectId') projectId: string,
  ) {
    const project = await this.projectService.findOneById(context, projectId);
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return this.apiKeyService.delete(context, {
      id,
      projectId,
      deletedBy: {
        user: user.id,
      },
    });
  }
}
