import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma, WebhookLog } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

import { EventsService, CacheService, PrismaService } from '@modules/core';
import {
  CreateWebhookLogDto,
  UpdateWebhookLogDto,
  DeleteWebhookLogDto,
  WebhookLogCreatedEvent,
  WebhookLogUpdatedEvent,
  WebhookLogDeletedEvent,
  ProjectEvents,
  WebhookLogDto,
  ProjectEntities,
} from '@contracts/project';
import {
  PageDto,
  PageMetaDto,
  PageOptionsDto,
  Context,
} from '@contracts/common';
import { EventAction } from '@contracts/events';

@Injectable()
export class WebhookLogService {
  private readonly logger = new Logger(WebhookLogService.name);

  static generateCacheId(webhookId: string, id: string) {
    return `Webhook-${webhookId}/WebhookLog-${id}/ID`;
  }

  static generateEntityId(entry: WebhookLog) {
    return `Webhook-${entry.webhookId}/WebhookLog-${entry.id}`;
  }

  constructor(
    private readonly cacheService: CacheService<WebhookLogDto>,
    private readonly prisma: PrismaService,
    private readonly eventsService: EventsService<WebhookLogDto>,
  ) {}

  async findOneById(
    context: Context,
    webhookId: string,
    id: string,
  ): Promise<WebhookLogDto | null> {
    const cachedData = await this.cacheService.get(
      WebhookLogService.generateCacheId(webhookId, id),
    );
    if (cachedData) {
      return plainToInstance(WebhookLogDto, cachedData, {
        excludeExtraneousValues: true,
        exposeDefaultValues: true,
      });
    }

    const entry = await this.prisma.webhookLog.findUnique({
      where: {
        id,
        webhookId,
        deletedAt: null,
      },
    });
    const dto = plainToInstance(WebhookLogDto, entry, {
      excludeExtraneousValues: true,
      exposeDefaultValues: true,
    });

    if (!!dto) {
      await this.cacheService.set(
        WebhookLogService.generateCacheId(webhookId, id),
        dto,
      );
    }

    return dto;
  }

  async findAll(
    context: Context,
    pageOptionsDto: PageOptionsDto,
    filters: Prisma.WebhookLogWhereInput = {},
  ): Promise<PageDto<WebhookLogDto>> {
    const [entries, total] = await Promise.all([
      this.prisma.webhookLog.findMany({
        take: pageOptionsDto.limit,
        skip: pageOptionsDto.offset,
        orderBy: {
          createdAt: pageOptionsDto.order,
        },
        where: {
          ...filters,
          deletedAt: null,
        },
      }),
      this.prisma.webhookLog.count({
        where: {
          ...filters,
          deletedAt: null,
        },
      }),
    ]);

    const pageMetaDto = new PageMetaDto({ total, pageOptionsDto });

    return new PageDto(
      entries.map((entry) =>
        plainToInstance(WebhookLogDto, entry, {
          excludeExtraneousValues: true,
          exposeDefaultValues: true,
        }),
      ),
      pageMetaDto,
    );
  }

  async create(
    context: Context,
    input: CreateWebhookLogDto,
  ): Promise<WebhookLogDto> {
    const entry = await this.prisma.webhookLog.create({
      data: {
        ...input,
        createdBy: input.createdBy as Prisma.InputJsonValue,
        updatedBy: input.createdBy as Prisma.InputJsonValue,
      },
    });
    const dto = plainToInstance(WebhookLogDto, entry, {
      excludeExtraneousValues: true,
      exposeDefaultValues: true,
    });

    await this.cacheService.set(
      WebhookLogService.generateCacheId(entry.webhookId, entry.id),
      dto,
    );

    this.eventsService.emitEvent({
      projectId: input.projectId,
      entity: ProjectEntities.WEBHOOK_LOG,
      entityId: WebhookLogService.generateEntityId(entry),
      eventName: ProjectEvents.WEBHOOK_LOG_CREATED,
      event: new WebhookLogCreatedEvent(),
      action: EventAction.CREATE,
      after: dto,
    });

    return dto;
  }

  async update(
    context: Context,
    { id, webhookId, projectId, updatedBy, ...data }: UpdateWebhookLogDto,
  ): Promise<WebhookLogDto> {
    const entry = await this.findOneById(context, webhookId, id);
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.webhookLog.update({
      where: {
        id,
        webhookId,
        projectId,
        deletedAt: null,
      },
      data: {
        updatedBy: updatedBy as Prisma.InputJsonValue,
        ...data,
      },
    });
    const dto = plainToInstance(WebhookLogDto, updatedEntry, {
      excludeExtraneousValues: true,
      exposeDefaultValues: true,
    });

    await this.cacheService.set(
      WebhookLogService.generateCacheId(webhookId, id),
      dto,
    );

    this.eventsService.emitEvent({
      projectId,
      entity: ProjectEntities.WEBHOOK_LOG,
      entityId: WebhookLogService.generateEntityId(updatedEntry),
      eventName: ProjectEvents.WEBHOOK_LOG_UPDATED,
      event: new WebhookLogUpdatedEvent(),
      action: EventAction.UPDATE,
      before: entry,
      after: dto,
    });

    return dto;
  }

  async delete(
    context: Context,
    input: DeleteWebhookLogDto,
  ): Promise<WebhookLogDto> {
    const { id, webhookId, projectId, deletedBy } = input;

    const entry = await this.findOneById(context, webhookId, id);
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.webhookLog.update({
      where: {
        id,
        webhookId,
        projectId,
        deletedAt: null,
      },
      data: {
        deletedBy: deletedBy as Prisma.InputJsonValue,
        deletedAt: new Date(),
      },
    });
    const dto = plainToInstance(WebhookLogDto, updatedEntry, {
      excludeExtraneousValues: true,
      exposeDefaultValues: true,
    });

    await this.cacheService.del(
      WebhookLogService.generateCacheId(webhookId, id),
    );

    this.eventsService.emitEvent({
      projectId,
      entity: ProjectEntities.WEBHOOK_LOG,
      entityId: WebhookLogService.generateEntityId(updatedEntry),
      eventName: ProjectEvents.WEBHOOK_LOG_DELETED,
      event: new WebhookLogDeletedEvent(),
      action: EventAction.DELETE,
      before: entry,
      after: dto,
    });

    return dto;
  }
}
