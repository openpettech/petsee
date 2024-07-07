import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma, SmsLog } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

import { EventsService, CacheService, PrismaService } from '@modules/core';
import {
  CreateSmsLogDto,
  UpdateSmsLogDto,
  DeleteSmsLogDto,
  SmsLogCreatedEvent,
  SmsLogUpdatedEvent,
  SmsLogDeletedEvent,
  CommunicationEvents,
  SmsLogDto,
  CommunicationEntities,
} from '@contracts/communication';
import {
  PageDto,
  PageMetaDto,
  PageOptionsDto,
  Context,
} from '@contracts/common';
import { EventAction } from '@contracts/events';
import { DEFAULT_CLASS_TRANFORM_OPTIONS } from '@constants/class-transformer.constant';

type GenerateCacheIdParams = {
  projectId: string;
  id: string;
};

type FindOneByIdParams = {
  projectId: string;
  id: string;
};

@Injectable()
export class SmsLogService {
  private readonly logger = new Logger(SmsLogService.name);

  static generateCacheId({ projectId, id }: GenerateCacheIdParams) {
    return `Project-${projectId}/SmsLog-${id}/ID`;
  }

  static generateEntityId(entry: SmsLog) {
    return `Project-${entry.projectId}/SmsLog-${entry.id}`;
  }

  constructor(
    private readonly cacheService: CacheService<SmsLogDto>,
    private readonly prisma: PrismaService,
    private readonly eventsService: EventsService<SmsLogDto>,
  ) {}

  async findOneById(
    context: Context,
    { projectId, id }: FindOneByIdParams,
  ): Promise<SmsLogDto | null> {
    const cachedData = await this.cacheService.get(
      SmsLogService.generateCacheId({ projectId, id }),
    );
    if (cachedData) {
      return plainToInstance(
        SmsLogDto,
        cachedData,
        DEFAULT_CLASS_TRANFORM_OPTIONS,
      );
    }

    const entry = await this.prisma.smsLog.findUnique({
      where: {
        id,
        projectId,
        deletedAt: null,
      },
    });
    const dto = plainToInstance(
      SmsLogDto,
      entry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    if (!!dto) {
      await this.cacheService.set(SmsLogService.generateCacheId(dto), dto);
    }

    return dto;
  }

  async findAll(
    context: Context,
    pageOptionsDto: PageOptionsDto,
    filters: Prisma.SmsLogWhereInput = {},
  ): Promise<PageDto<SmsLogDto>> {
    const [entries, total] = await Promise.all([
      this.prisma.smsLog.findMany({
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
      this.prisma.smsLog.count({
        where: {
          ...filters,
          deletedAt: null,
        },
      }),
    ]);

    const pageMetaDto = new PageMetaDto({ total, pageOptionsDto });

    return new PageDto(
      entries.map((entry) =>
        plainToInstance(SmsLogDto, entry, DEFAULT_CLASS_TRANFORM_OPTIONS),
      ),
      pageMetaDto,
    );
  }

  async create(
    context: Context,
    { projectId, ...input }: CreateSmsLogDto,
  ): Promise<SmsLogDto> {
    const entry = await this.prisma.smsLog.create({
      data: {
        ...input,
        projectId,
        createdBy: input.createdBy as Prisma.InputJsonValue,
        updatedBy: input.createdBy as Prisma.InputJsonValue,
      },
    });
    const dto = plainToInstance(
      SmsLogDto,
      entry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.set(SmsLogService.generateCacheId(entry), dto);

    this.eventsService.emitEvent({
      projectId,
      entity: CommunicationEntities.SMS_LOG,
      entityId: SmsLogService.generateEntityId(entry),
      eventName: CommunicationEvents.SMS_LOG_CREATED,
      event: new SmsLogCreatedEvent(),
      action: EventAction.CREATE,
      after: dto,
    });

    return dto;
  }

  async update(
    context: Context,
    { id, projectId, updatedBy, ...data }: UpdateSmsLogDto,
  ): Promise<SmsLogDto> {
    const entry = await this.findOneById(context, { projectId, id });
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.smsLog.update({
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
      SmsLogDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.set(SmsLogService.generateCacheId(dto), dto);

    this.eventsService.emitEvent({
      projectId,
      entity: CommunicationEntities.SMS_LOG,
      entityId: SmsLogService.generateEntityId(updatedEntry),
      eventName: CommunicationEvents.SMS_LOG_UPDATED,
      event: new SmsLogUpdatedEvent(),
      action: EventAction.UPDATE,
      before: entry,
      after: dto,
    });

    return dto;
  }

  async delete(context: Context, input: DeleteSmsLogDto): Promise<SmsLogDto> {
    const { id, projectId, deletedBy } = input;

    const entry = await this.findOneById(context, { projectId, id });
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.smsLog.update({
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
      SmsLogDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.del(SmsLogService.generateCacheId(dto));

    this.eventsService.emitEvent({
      projectId,
      entity: CommunicationEntities.SMS_LOG,
      entityId: SmsLogService.generateEntityId(updatedEntry),
      eventName: CommunicationEvents.SMS_LOG_DELETED,
      event: new SmsLogDeletedEvent(),
      action: EventAction.DELETE,
      before: entry,
      after: dto,
    });

    return dto;
  }
}
