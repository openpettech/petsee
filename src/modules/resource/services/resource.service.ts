import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma, Resource } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

import { EventsService, CacheService, PrismaService } from '@modules/core';
import {
  CreateResourceDto,
  UpdateResourceDto,
  DeleteResourceDto,
  ResourceCreatedEvent,
  ResourceUpdatedEvent,
  ResourceDeletedEvent,
  ResourceEvents,
  ResourceDto,
  ResourceEntities,
} from '@contracts/resource';
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
export class ResourceService {
  private readonly logger = new Logger(ResourceService.name);

  static generateCacheId({ projectId, id }: GenerateCacheIdParams) {
    return `Project-${projectId}/Resource-${id}/ID`;
  }

  static generateEntityId(entry: Resource) {
    return `Project-${entry.projectId}/Resource-${entry.id}`;
  }

  constructor(
    private readonly cacheService: CacheService<ResourceDto>,
    private readonly prisma: PrismaService,
    private readonly eventsService: EventsService<ResourceDto>,
  ) {}

  async findOneById(
    context: Context,
    { projectId, id }: FindOneByIdParams,
  ): Promise<ResourceDto | null> {
    const cachedData = await this.cacheService.get(
      ResourceService.generateCacheId({ projectId, id }),
    );
    if (cachedData) {
      return plainToInstance(
        ResourceDto,
        cachedData,
        DEFAULT_CLASS_TRANFORM_OPTIONS,
      );
    }

    const entry = await this.prisma.resource.findUnique({
      where: {
        id,
        projectId,
        deletedAt: null,
      },
    });
    const dto = plainToInstance(
      ResourceDto,
      entry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    if (!!dto) {
      await this.cacheService.set(ResourceService.generateCacheId(dto), dto);
    }

    return dto;
  }

  async findAll(
    context: Context,
    pageOptionsDto: PageOptionsDto,
    filters: Prisma.ResourceWhereInput = {},
  ): Promise<PageDto<ResourceDto>> {
    const [entries, total] = await Promise.all([
      this.prisma.resource.findMany({
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
      this.prisma.resource.count({
        where: {
          ...filters,
          deletedAt: null,
        },
      }),
    ]);

    const pageMetaDto = new PageMetaDto({ total, pageOptionsDto });

    return new PageDto(
      entries.map((entry) =>
        plainToInstance(ResourceDto, entry, DEFAULT_CLASS_TRANFORM_OPTIONS),
      ),
      pageMetaDto,
    );
  }

  async create(
    context: Context,
    { projectId, resourceTypeId, ...input }: CreateResourceDto,
  ): Promise<ResourceDto> {
    const entry = await this.prisma.resource.create({
      data: {
        ...input,
        project: createConnectObject(projectId),
        resourceType: createConnectObject(resourceTypeId),
        createdBy: input.createdBy as Prisma.InputJsonValue,
        updatedBy: input.createdBy as Prisma.InputJsonValue,
      },
    });
    const dto = plainToInstance(
      ResourceDto,
      entry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.set(ResourceService.generateCacheId(entry), dto);

    this.eventsService.emitEvent({
      projectId,
      entity: ResourceEntities.RESOURCE_TYPE,
      entityId: ResourceService.generateEntityId(entry),
      eventName: ResourceEvents.RESOURCE_TYPE_CREATED,
      event: new ResourceCreatedEvent(),
      action: EventAction.CREATE,
      after: dto,
    });

    return dto;
  }

  async update(
    context: Context,
    { id, projectId, updatedBy, ...data }: UpdateResourceDto,
  ): Promise<ResourceDto> {
    const entry = await this.findOneById(context, { projectId, id });
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.resource.update({
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
      ResourceDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.set(ResourceService.generateCacheId(dto), dto);

    this.eventsService.emitEvent({
      projectId,
      entity: ResourceEntities.RESOURCE_TYPE,
      entityId: ResourceService.generateEntityId(updatedEntry),
      eventName: ResourceEvents.RESOURCE_TYPE_UPDATED,
      event: new ResourceUpdatedEvent(),
      action: EventAction.UPDATE,
      before: entry,
      after: dto,
    });

    return dto;
  }

  async delete(
    context: Context,
    input: DeleteResourceDto,
  ): Promise<ResourceDto> {
    const { id, projectId, deletedBy } = input;

    const entry = await this.findOneById(context, { projectId, id });
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.resource.update({
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
      ResourceDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.del(ResourceService.generateCacheId(dto));

    this.eventsService.emitEvent({
      projectId,
      entity: ResourceEntities.RESOURCE_TYPE,
      entityId: ResourceService.generateEntityId(updatedEntry),
      eventName: ResourceEvents.RESOURCE_TYPE_DELETED,
      event: new ResourceDeletedEvent(),
      action: EventAction.DELETE,
      before: entry,
      after: dto,
    });

    return dto;
  }
}
