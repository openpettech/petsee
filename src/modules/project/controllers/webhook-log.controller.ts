import {
  Controller,
  Get,
  Post,
  Param,
  NotFoundException,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AuthGuard } from '@nestjs/passport';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { WebhookRequestStatus } from '@prisma/client';

import { WebhookLogDto } from '@contracts/project';
import {
  PageOptionsDto,
  ApiPaginatedResponse,
  Context,
} from '@contracts/common';
import { Auth0UserDto } from '@contracts/auth';
import { Ctx, CurrentUser } from '@shared/decorators';

import { WebhookLogService, WebhookService } from '../services';

@ApiTags('Project')
@Controller('projects/:projectId/webhooks/:webhookId/logs')
@UseGuards(AuthGuard('Auth0'))
export class WebhookLogController {
  private readonly logger = new Logger(WebhookLogController.name);

  constructor(
    private readonly webhookService: WebhookService,
    private readonly webhookLogService: WebhookLogService,
    private readonly httpService: HttpService,
  ) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(WebhookLogDto)
  async list(
    @Query() pageOptionsDto: PageOptionsDto,
    @Ctx() context: Context,
    @Param('projectId') projectId: string,
    @Param('webhookId') webhookId: string,
  ) {
    const webhook = await this.webhookService.findOneById(
      context,
      projectId,
      webhookId,
    );
    if (!webhook) {
      throw new NotFoundException('Webhook not found');
    }

    return this.webhookLogService.findAll(context, pageOptionsDto, {
      webhookId,
      projectId,
    });
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: WebhookLogDto,
  })
  async get(
    @Ctx() context: Context,
    @Param('id') id: string,
    @Param('projectId') projectId: string,
    @Param('webhookId') webhookId: string,
  ) {
    const webhook = await this.webhookService.findOneById(
      context,
      projectId,
      webhookId,
    );
    if (!webhook) {
      throw new NotFoundException('Webhook not found');
    }

    const entry = await this.webhookLogService.findOneById(
      context,
      webhookId,
      id,
    );
    if (!entry) {
      throw new NotFoundException('Webhook Log not found');
    }

    return entry;
  }

  @Post('/:id/resend')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been resend successfuly.',
    type: WebhookLogDto,
  })
  async resend(
    @Ctx() context: Context,
    @CurrentUser() user: Auth0UserDto,
    @Param('projectId') projectId: string,
    @Param('webhookId') webhookId: string,
    @Param('id') id: string,
  ) {
    const webhook = await this.webhookService.findOneById(
      context,
      projectId,
      webhookId,
    );
    if (!webhook) {
      throw new NotFoundException('Webhook not found');
    }

    const entry = await this.webhookLogService.findOneById(
      context,
      webhookId,
      id,
    );
    if (!entry) {
      throw new NotFoundException('Webhook Log not found');
    }

    try {
      const { data, status, headers } = await this.httpService.axiosRef.post(
        webhook.url,
        entry.request,
      );
      this.logger.log(
        `[Project:${webhook.projectId}][Webhook:${webhook.id}] ${entry.request.eventName!} sent`,
      );
      const input = {
        data,
        status,
        headers,
      };

      return this.webhookLogService.update(context, {
        id,
        webhookId,
        projectId,
        response: input,
        status: WebhookRequestStatus.SUCCEEDED,
        updatedBy: {
          user: user.id,
        },
      });
    } catch (err) {
      this.logger.error(
        `[Project:${webhook.projectId}][Webhook:${webhook.id}] Error - ${err.message}}`,
      );
      return this.webhookLogService.update(context, {
        id,
        webhookId,
        projectId,
        response: err,
        status: WebhookRequestStatus.ERRORED,
        updatedBy: {
          user: user.id,
        },
      });
    }
  }
}
