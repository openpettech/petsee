import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma, Webhook } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

import { EventsService, CacheService, PrismaService } from '@modules/core';
import {
  CreateWebhookDto,
  UpdateWebhookDto,
  DeleteWebhookDto,
  WebhookCreatedEvent,
  WebhookUpdatedEvent,
  WebhookDeletedEvent,
  ProjectEvents,
  WebhookDto,
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
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  static generateCacheId(projectId: string, id: string) {
    return `Project-${projectId}/Webhook-${id}/ID`;
  }

  static generateEntityId(entry: Webhook) {
    return `Project-${entry.projectId}/Webhook-${entry.id}`;
  }

  constructor(
    private readonly cacheService: CacheService<WebhookDto>,
    private readonly prisma: PrismaService,
    private readonly eventsService: EventsService<WebhookDto>,
  ) {}

  async findOneById(
    context: Context,
    projectId: string,
    id: string,
  ): Promise<WebhookDto | null> {
    const cachedData = await this.cacheService.get(
      WebhookService.generateCacheId(projectId, id),
    );
    if (cachedData) {
      return plainToInstance(WebhookDto, cachedData, {
        excludeExtraneousValues: true,
        exposeDefaultValues: true,
      });
    }

    const entry = await this.prisma.webhook.findUnique({
      where: {
        id,
        projectId,
        deletedAt: null,
      },
    });
    const dto = plainToInstance(WebhookDto, entry, {
      excludeExtraneousValues: true,
      exposeDefaultValues: true,
    });

    if (!!dto) {
      await this.cacheService.set(
        WebhookService.generateCacheId(projectId, id),
        dto,
      );
    }

    return dto;
  }

  async findAll(
    context: Context,
    pageOptionsDto: PageOptionsDto,
    filters: Prisma.WebhookWhereInput = {},
  ): Promise<PageDto<WebhookDto>> {
    const [entries, total] = await Promise.all([
      this.prisma.webhook.findMany({
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
      this.prisma.webhook.count({
        where: {
          ...filters,
          deletedAt: null,
        },
      }),
    ]);

    const pageMetaDto = new PageMetaDto({ total, pageOptionsDto });

    return new PageDto(
      entries.map((entry) =>
        plainToInstance(WebhookDto, entry, {
          excludeExtraneousValues: true,
          exposeDefaultValues: true,
        }),
      ),
      pageMetaDto,
    );
  }

  async create(context: Context, input: CreateWebhookDto): Promise<WebhookDto> {
    const entry = await this.prisma.webhook.create({
      data: {
        ...input,
        createdBy: input.createdBy as Prisma.InputJsonValue,
        updatedBy: input.createdBy as Prisma.InputJsonValue,
      },
    });
    const dto = plainToInstance(WebhookDto, entry, {
      excludeExtraneousValues: true,
      exposeDefaultValues: true,
    });

    await this.cacheService.set(
      WebhookService.generateCacheId(entry.projectId, entry.id),
      dto,
    );

    this.eventsService.emitEvent({
      projectId: input.projectId,
      entity: ProjectEntities.WEBHOOK,
      entityId: WebhookService.generateEntityId(entry),
      eventName: ProjectEvents.WEBHOOK_CREATED,
      event: new WebhookCreatedEvent(),
      action: EventAction.CREATE,
      after: dto,
    });

    return dto;
  }

  async update(
    context: Context,
    { id, projectId, updatedBy, ...data }: UpdateWebhookDto,
  ): Promise<WebhookDto> {
    const entry = await this.findOneById(context, projectId, id);
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.webhook.update({
      where: {
        id,
        projectId,
        deletedAt: null,
      },
      data: {
        updatedBy: updatedBy as Prisma.InputJsonValue,
        ...data,
      },
    });
    const dto = plainToInstance(WebhookDto, updatedEntry, {
      excludeExtraneousValues: true,
      exposeDefaultValues: true,
    });

    await this.cacheService.set(
      WebhookService.generateCacheId(projectId, id),
      dto,
    );

    this.eventsService.emitEvent({
      projectId,
      entity: ProjectEntities.WEBHOOK,
      entityId: WebhookService.generateEntityId(updatedEntry),
      eventName: ProjectEvents.WEBHOOK_UPDATED,
      event: new WebhookUpdatedEvent(),
      action: EventAction.UPDATE,
      before: entry,
      after: dto,
    });

    return dto;
  }

  async delete(context: Context, input: DeleteWebhookDto): Promise<WebhookDto> {
    const { id, projectId, deletedBy } = input;

    const entry = await this.findOneById(context, projectId, id);
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.webhook.update({
      where: {
        id,
        projectId,
        deletedAt: null,
      },
      data: {
        deletedBy: deletedBy as Prisma.InputJsonValue,
        deletedAt: new Date(),
      },
    });
    const dto = plainToInstance(WebhookDto, updatedEntry, {
      excludeExtraneousValues: true,
      exposeDefaultValues: true,
    });

    await this.cacheService.del(WebhookService.generateCacheId(projectId, id));

    this.eventsService.emitEvent({
      projectId,
      entity: ProjectEntities.WEBHOOK,
      entityId: WebhookService.generateEntityId(updatedEntry),
      eventName: ProjectEvents.WEBHOOK_DELETED,
      event: new WebhookDeletedEvent(),
      action: EventAction.DELETE,
      before: entry,
      after: dto,
    });

    return dto;
  }
}
