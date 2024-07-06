import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma, ServiceOverride } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

import { EventsService, CacheService, PrismaService } from '@modules/core';
import {
  CreateServiceOverrideDto,
  UpdateServiceOverrideDto,
  DeleteServiceOverrideDto,
  ServiceOverrideCreatedEvent,
  ServiceOverrideUpdatedEvent,
  ServiceOverrideDeletedEvent,
  ServiceOverrideDto,
  ServiceEvents,
  ServiceEntities,
} from '@contracts/service';
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
export class ServiceOverrideService {
  private readonly logger = new Logger(ServiceOverrideService.name);

  static generateCacheId({ projectId, id }: GenerateCacheIdParams) {
    return `Project-${projectId}/ServiceOverride-${id}/ID`;
  }

  static generateEntityId(entry: ServiceOverride) {
    return `Project-${entry.projectId}/ServiceOverride-${entry.id}`;
  }

  constructor(
    private readonly cacheService: CacheService<ServiceOverrideDto>,
    private readonly prisma: PrismaService,
    private readonly eventsService: EventsService<ServiceOverrideDto>,
  ) {}

  async findOneById(
    context: Context,
    { projectId, id }: FindOneByIdParams,
  ): Promise<ServiceOverrideDto | null> {
    const cachedData = await this.cacheService.get(
      ServiceOverrideService.generateCacheId({ projectId, id }),
    );
    if (cachedData) {
      return plainToInstance(
        ServiceOverrideDto,
        cachedData,
        DEFAULT_CLASS_TRANFORM_OPTIONS,
      );
    }

    const entry = await this.prisma.serviceOverride.findUnique({
      where: {
        id,
        projectId,
        deletedAt: null,
      },
    });
    const dto = plainToInstance(
      ServiceOverrideDto,
      entry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    if (!!dto) {
      await this.cacheService.set(
        ServiceOverrideService.generateCacheId(dto),
        dto,
      );
    }

    return dto;
  }

  async findAll(
    context: Context,
    pageOptionsDto: PageOptionsDto,
    filters: Prisma.ServiceOverrideWhereInput = {},
  ): Promise<PageDto<ServiceOverrideDto>> {
    const [entries, total] = await Promise.all([
      this.prisma.serviceOverride.findMany({
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
      this.prisma.serviceOverride.count({
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
          ServiceOverrideDto,
          entry,
          DEFAULT_CLASS_TRANFORM_OPTIONS,
        ),
      ),
      pageMetaDto,
    );
  }

  async create(
    context: Context,
    { projectId, serviceId, ...input }: CreateServiceOverrideDto,
  ): Promise<ServiceOverrideDto> {
    const entry = await this.prisma.serviceOverride.create({
      data: {
        ...input,
        project: createConnectObject(projectId),
        service: createConnectObject(serviceId),
        createdBy: input.createdBy as Prisma.InputJsonValue,
        updatedBy: input.createdBy as Prisma.InputJsonValue,
      },
    });
    const dto = plainToInstance(
      ServiceOverrideDto,
      entry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.set(
      ServiceOverrideService.generateCacheId(entry),
      dto,
    );

    this.eventsService.emitEvent({
      projectId,
      entity: ServiceEntities.SERVICE_OVERRIDE,
      entityId: ServiceOverrideService.generateEntityId(entry),
      eventName: ServiceEvents.SERVICE_OVERRIDE_CREATED,
      event: new ServiceOverrideCreatedEvent(),
      action: EventAction.CREATE,
      after: dto,
    });

    return dto;
  }

  async update(
    context: Context,
    { id, projectId, updatedBy, ...data }: UpdateServiceOverrideDto,
  ): Promise<ServiceOverrideDto> {
    const entry = await this.findOneById(context, { projectId, id });
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.serviceOverride.update({
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
      ServiceOverrideDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.set(
      ServiceOverrideService.generateCacheId(dto),
      dto,
    );

    this.eventsService.emitEvent({
      projectId,
      entity: ServiceEntities.SERVICE_OVERRIDE,
      entityId: ServiceOverrideService.generateEntityId(updatedEntry),
      eventName: ServiceEvents.SERVICE_OVERRIDE_UPDATED,
      event: new ServiceOverrideUpdatedEvent(),
      action: EventAction.UPDATE,
      before: entry,
      after: dto,
    });

    return dto;
  }

  async delete(
    context: Context,
    input: DeleteServiceOverrideDto,
  ): Promise<ServiceOverrideDto> {
    const { id, projectId, deletedBy } = input;

    const entry = await this.findOneById(context, { projectId, id });
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.serviceOverride.update({
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
      ServiceOverrideDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.del(ServiceOverrideService.generateCacheId(dto));

    this.eventsService.emitEvent({
      projectId,
      entity: ServiceEntities.SERVICE_OVERRIDE,
      entityId: ServiceOverrideService.generateEntityId(updatedEntry),
      eventName: ServiceEvents.SERVICE_OVERRIDE_DELETED,
      event: new ServiceOverrideDeletedEvent(),
      action: EventAction.DELETE,
      before: entry,
      after: dto,
    });

    return dto;
  }
}
