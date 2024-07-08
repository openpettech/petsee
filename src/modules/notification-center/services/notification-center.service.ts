import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma, NotificationCenter } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

import { EventsService, CacheService, PrismaService } from '@modules/core';
import {
  CreateNotificationCenterDto,
  UpdateNotificationCenterDto,
  DeleteNotificationCenterDto,
  NotificationCenterCreatedEvent,
  NotificationCenterUpdatedEvent,
  NotificationCenterDeletedEvent,
  NotificationCenterEvents,
  NotificationCenterDto,
  NotificationCenterEntities,
} from '@contracts/notification-center';
import {
  PageDto,
  PageMetaDto,
  PageOptionsDto,
  Context,
} from '@contracts/common';
import { EventAction } from '@contracts/events';
import { DEFAULT_CLASS_TRANFORM_OPTIONS } from '@constants/class-transformer.constant';
import { createConnectObject } from '@utils/prisma';

type GenerateCacheIdParams = {
  projectId: string;
  id: string;
};

type FindOneByIdParams = {
  projectId: string;
  id: string;
};

@Injectable()
export class NotificationCenterService {
  private readonly logger = new Logger(NotificationCenterService.name);

  static generateCacheId({ projectId, id }: GenerateCacheIdParams) {
    return `Project-${projectId}/NotificationCenter-${id}/ID`;
  }

  static generateEntityId(entry: NotificationCenter) {
    return `Project-${entry.projectId}/NotificationCenter-${entry.id}`;
  }

  constructor(
    private readonly cacheService: CacheService<NotificationCenterDto>,
    private readonly prisma: PrismaService,
    private readonly eventsService: EventsService<NotificationCenterDto>,
  ) {}

  async findOneById(
    context: Context,
    { projectId, id }: FindOneByIdParams,
  ): Promise<NotificationCenterDto | null> {
    const cachedData = await this.cacheService.get(
      NotificationCenterService.generateCacheId({ projectId, id }),
    );
    if (cachedData) {
      return plainToInstance(
        NotificationCenterDto,
        cachedData,
        DEFAULT_CLASS_TRANFORM_OPTIONS,
      );
    }

    const entry = await this.prisma.notificationCenter.findUnique({
      where: {
        id,
        projectId,
        deletedAt: null,
      },
    });
    const dto = plainToInstance(
      NotificationCenterDto,
      entry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    if (!!dto) {
      await this.cacheService.set(
        NotificationCenterService.generateCacheId(dto),
        dto,
      );
    }

    return dto;
  }

  async findAll(
    context: Context,
    pageOptionsDto: PageOptionsDto,
    filters: Prisma.NotificationCenterWhereInput = {},
  ): Promise<PageDto<NotificationCenterDto>> {
    const [entries, total] = await Promise.all([
      this.prisma.notificationCenter.findMany({
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
      this.prisma.notificationCenter.count({
        where: {
          ...filters,
          deletedAt: null,
        },
      }),
    ]);

    const pageMetaDto = new PageMetaDto({ total, pageOptionsDto });

    return new PageDto(
      entries.map((entry) =>
        plainToInstance(
          NotificationCenterDto,
          entry,
          DEFAULT_CLASS_TRANFORM_OPTIONS,
        ),
      ),
      pageMetaDto,
    );
  }

  async create(
    context: Context,
    { projectId, ...input }: CreateNotificationCenterDto,
  ): Promise<NotificationCenterDto> {
    const entry = await this.prisma.notificationCenter.create({
      data: {
        ...input,
        project: createConnectObject(projectId),
        createdBy: input.createdBy as Prisma.InputJsonValue,
        updatedBy: input.createdBy as Prisma.InputJsonValue,
      },
    });
    const dto = plainToInstance(
      NotificationCenterDto,
      entry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.set(
      NotificationCenterService.generateCacheId(entry),
      dto,
    );

    this.eventsService.emitEvent({
      projectId,
      entity: NotificationCenterEntities.NOTIFICATION_CENTER,
      entityId: NotificationCenterService.generateEntityId(entry),
      eventName: NotificationCenterEvents.NOTIFICATION_CENTER_CREATED,
      event: new NotificationCenterCreatedEvent(),
      action: EventAction.CREATE,
      after: dto,
    });

    return dto;
  }

  async update(
    context: Context,
    { id, projectId, updatedBy, ...data }: UpdateNotificationCenterDto,
  ): Promise<NotificationCenterDto> {
    const entry = await this.findOneById(context, { projectId, id });
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.notificationCenter.update({
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
    const dto = plainToInstance(
      NotificationCenterDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.set(
      NotificationCenterService.generateCacheId(dto),
      dto,
    );

    this.eventsService.emitEvent({
      projectId,
      entity: NotificationCenterEntities.NOTIFICATION_CENTER,
      entityId: NotificationCenterService.generateEntityId(updatedEntry),
      eventName: NotificationCenterEvents.NOTIFICATION_CENTER_UPDATED,
      event: new NotificationCenterUpdatedEvent(),
      action: EventAction.UPDATE,
      before: entry,
      after: dto,
    });

    return dto;
  }

  async delete(
    context: Context,
    input: DeleteNotificationCenterDto,
  ): Promise<NotificationCenterDto> {
    const { id, projectId, deletedBy } = input;

    const entry = await this.findOneById(context, { projectId, id });
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.notificationCenter.update({
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
    const dto = plainToInstance(
      NotificationCenterDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.del(NotificationCenterService.generateCacheId(dto));

    this.eventsService.emitEvent({
      projectId,
      entity: NotificationCenterEntities.NOTIFICATION_CENTER,
      entityId: NotificationCenterService.generateEntityId(updatedEntry),
      eventName: NotificationCenterEvents.NOTIFICATION_CENTER_DELETED,
      event: new NotificationCenterDeletedEvent(),
      action: EventAction.DELETE,
      before: entry,
      after: dto,
    });

    return dto;
  }
}
