import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma, Service } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

import { EventsService, CacheService, PrismaService } from '@modules/core';
import {
  CreateServiceDto,
  UpdateServiceDto,
  DeleteServiceDto,
  ServiceCreatedEvent,
  ServiceUpdatedEvent,
  ServiceDeletedEvent,
  ServiceEvents,
  ServiceDto,
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
import { createConnectArrayObject } from '@utils/prisma';

type GenerateCacheIdParams = {
  projectId: string;
  id: string;
};

type FindOneByIdParams = {
  projectId: string;
  id: string;
};

@Injectable()
export class ServiceService {
  private readonly logger = new Logger(ServiceService.name);

  static generateCacheId({ projectId, id }: GenerateCacheIdParams) {
    return `Project-${projectId}/Service-${id}/ID`;
  }

  static generateEntityId(entry: Service) {
    return `Project-${entry.projectId}/Service-${entry.id}`;
  }

  constructor(
    private readonly cacheService: CacheService<ServiceDto>,
    private readonly prisma: PrismaService,
    private readonly eventsService: EventsService<ServiceDto>,
  ) {}

  async findOneById(
    context: Context,
    { projectId, id }: FindOneByIdParams,
  ): Promise<ServiceDto | null> {
    const cachedData = await this.cacheService.get(
      ServiceService.generateCacheId({ projectId, id }),
    );
    if (cachedData) {
      return plainToInstance(
        ServiceDto,
        cachedData,
        DEFAULT_CLASS_TRANFORM_OPTIONS,
      );
    }

    const entry = await this.prisma.service.findUnique({
      where: {
        id,
        projectId,
        deletedAt: null,
      },
    });
    const dto = plainToInstance(
      ServiceDto,
      entry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    if (!!dto) {
      await this.cacheService.set(ServiceService.generateCacheId(dto), dto);
    }

    return dto;
  }

  async findAll(
    context: Context,
    pageOptionsDto: PageOptionsDto,
    filters: Prisma.ServiceWhereInput = {},
  ): Promise<PageDto<ServiceDto>> {
    const [entries, total] = await Promise.all([
      this.prisma.service.findMany({
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
      this.prisma.service.count({
        where: {
          ...filters,
          deletedAt: null,
        },
      }),
    ]);

    const pageMetaDto = new PageMetaDto({ total, pageOptionsDto });

    return new PageDto(
      entries.map((entry) =>
        plainToInstance(ServiceDto, entry, DEFAULT_CLASS_TRANFORM_OPTIONS),
      ),
      pageMetaDto,
    );
  }

  async create(
    context: Context,
    {
      projectId,
      tagIds,
      speciesIds,
      breedIds,
      groupIds,
      merchantIds,
      facilityIds,
      ...input
    }: CreateServiceDto,
  ): Promise<ServiceDto> {
    const entry = await this.prisma.service.create({
      data: {
        ...input,
        projectId,
        tags: createConnectArrayObject(tagIds, { projectId }),
        species: createConnectArrayObject(speciesIds),
        breeds: createConnectArrayObject(breedIds),
        groups: createConnectArrayObject(groupIds, { projectId }),
        merchants: createConnectArrayObject(groupIds, { merchantIds }),
        facilities: createConnectArrayObject(groupIds, { facilityIds }),
        createdBy: input.createdBy as Prisma.InputJsonValue,
        updatedBy: input.createdBy as Prisma.InputJsonValue,
      },
    });
    const dto = plainToInstance(
      ServiceDto,
      entry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.set(ServiceService.generateCacheId(entry), dto);

    this.eventsService.emitEvent({
      projectId,
      entity: ServiceEntities.SERVICE,
      entityId: ServiceService.generateEntityId(entry),
      eventName: ServiceEvents.SERVICE_CREATED,
      event: new ServiceCreatedEvent(),
      action: EventAction.CREATE,
      after: dto,
    });

    return dto;
  }

  async update(
    context: Context,
    {
      id,
      projectId,
      tagIds,
      speciesIds,
      breedIds,
      groupIds,
      merchantIds,
      facilityIds,
      updatedBy,
      ...data
    }: UpdateServiceDto,
  ): Promise<ServiceDto> {
    const entry = await this.findOneById(context, { projectId, id });
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.service.update({
      where: {
        id,
        projectId,
        deletedAt: null,
      },
      data: {
        updatedBy: updatedBy as Prisma.InputJsonValue,
        tags: createConnectArrayObject(tagIds, { projectId }),
        species: createConnectArrayObject(speciesIds),
        breeds: createConnectArrayObject(breedIds),
        groups: createConnectArrayObject(groupIds, { projectId }),
        merchants: createConnectArrayObject(groupIds, { merchantIds }),
        facilities: createConnectArrayObject(groupIds, { facilityIds }),
        ...data,
      },
    });
    const dto = plainToInstance(
      ServiceDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.set(ServiceService.generateCacheId(dto), dto);

    this.eventsService.emitEvent({
      projectId,
      entity: ServiceEntities.SERVICE,
      entityId: ServiceService.generateEntityId(updatedEntry),
      eventName: ServiceEvents.SERVICE_UPDATED,
      event: new ServiceUpdatedEvent(),
      action: EventAction.UPDATE,
      before: entry,
      after: dto,
    });

    return dto;
  }

  async delete(context: Context, input: DeleteServiceDto): Promise<ServiceDto> {
    const { id, projectId, deletedBy } = input;

    const entry = await this.findOneById(context, { projectId, id });
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.service.update({
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
      ServiceDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.del(ServiceService.generateCacheId(dto));

    this.eventsService.emitEvent({
      projectId,
      entity: ServiceEntities.SERVICE,
      entityId: ServiceService.generateEntityId(updatedEntry),
      eventName: ServiceEvents.SERVICE_DELETED,
      event: new ServiceDeletedEvent(),
      action: EventAction.DELETE,
      before: entry,
      after: dto,
    });

    return dto;
  }
}
