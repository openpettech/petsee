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
  WebhookDto,
  CreateWebhookRequest,
  UpdateWebhookRequest,
} from '@contracts/project';
import {
  PageOptionsDto,
  ApiPaginatedResponse,
  Context,
  ServiceRole,
} from '@contracts/common';
import { Ctx, TriggeredBy } from '@shared/decorators';

import { WebhookService, ProjectService } from '../services';

@ApiTags('Project')
@Controller('projects/:projectId/webhooks')
@UseGuards(AuthGuard('Auth0'))
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(
    private readonly projectService: ProjectService,
    private readonly webhookService: WebhookService,
  ) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(WebhookDto)
  async list(
    @Query() pageOptionsDto: PageOptionsDto,
    @Ctx() context: Context,
    @Param('projectId') projectId: string,
  ) {
    const project = await this.projectService.findOneById(context, projectId);
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return this.webhookService.findAll(context, pageOptionsDto, { projectId });
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: WebhookDto,
  })
  async get(
    @Ctx() context: Context,
    @Param('id') id: string,
    @Param('projectId') projectId: string,
  ) {
    const project = await this.projectService.findOneById(context, projectId);
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const entry = await this.webhookService.findOneById(context, projectId, id);
    if (!entry) {
      throw new NotFoundException('Webhook not found');
    }

    return entry;
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: WebhookDto,
  })
  async create(
    @Body()
    createWebhookDto: CreateWebhookRequest,
    @Ctx() context: Context,
    @TriggeredBy() triggeredBy: ServiceRole,
    @Param('projectId') projectId: string,
  ) {
    const project = await this.projectService.findOneById(context, projectId);
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return this.webhookService.create(context, {
      projectId,
      createdBy: triggeredBy,
      ...createWebhookDto,
    });
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully updated.',
    type: WebhookDto,
  })
  async update(
    @Body() updateWebhookDto: UpdateWebhookRequest,
    @Ctx() context: Context,
    @TriggeredBy() triggeredBy: ServiceRole,
    @Param('id') id: string,
    @Param('projectId') projectId: string,
  ) {
    const project = await this.projectService.findOneById(context, projectId);
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return this.webhookService.update(context, {
      id,
      projectId,
      ...updateWebhookDto,
      updatedBy: triggeredBy,
    });
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'The record has been successfully deleted.',
    type: WebhookDto,
  })
  async delete(
    @Ctx() context: Context,
    @TriggeredBy() triggeredBy: ServiceRole,
    @Param('id') id: string,
    @Param('projectId') projectId: string,
  ) {
    const project = await this.projectService.findOneById(context, projectId);
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return this.webhookService.delete(context, {
      id,
      projectId,
      deletedBy: triggeredBy,
    });
  }
}
