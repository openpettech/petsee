import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma, Location } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

import { EventsService, CacheService, PrismaService } from '@modules/core';
import {
  CreateLocationDto,
  UpdateLocationDto,
  DeleteLocationDto,
  LocationCreatedEvent,
  LocationUpdatedEvent,
  LocationDeletedEvent,
  LocationEvents,
  LocationDto,
  LocationEntities,
} from '@contracts/location';
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
export class LocationService {
  private readonly logger = new Logger(LocationService.name);

  static generateCacheId({ projectId, id }: GenerateCacheIdParams) {
    return `Project-${projectId}/Location-${id}/ID`;
  }

  static generateEntityId(entry: Location) {
    return `Project-${entry.projectId}/Location-${entry.id}`;
  }

  constructor(
    private readonly cacheService: CacheService<LocationDto>,
    private readonly prisma: PrismaService,
    private readonly eventsService: EventsService<LocationDto>,
  ) {}

  async findOneById(
    context: Context,
    { projectId, id }: FindOneByIdParams,
  ): Promise<LocationDto | null> {
    const cachedData = await this.cacheService.get(
      LocationService.generateCacheId({ projectId, id }),
    );
    if (cachedData) {
      return plainToInstance(
        LocationDto,
        cachedData,
        DEFAULT_CLASS_TRANFORM_OPTIONS,
      );
    }

    const entry = await this.prisma.location.findUnique({
      where: {
        id,
        projectId,
        deletedAt: null,
      },
    });
    const dto = plainToInstance(
      LocationDto,
      entry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    if (!!dto) {
      await this.cacheService.set(LocationService.generateCacheId(dto), dto);
    }

    return dto;
  }

  async findAll(
    context: Context,
    pageOptionsDto: PageOptionsDto,
    filters: Prisma.LocationWhereInput = {},
  ): Promise<PageDto<LocationDto>> {
    const [entries, total] = await Promise.all([
      this.prisma.location.findMany({
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
      this.prisma.location.count({
        where: {
          ...filters,
          deletedAt: null,
        },
      }),
    ]);

    const pageMetaDto = new PageMetaDto({ total, pageOptionsDto });

    return new PageDto(
      entries.map((entry) =>
        plainToInstance(LocationDto, entry, DEFAULT_CLASS_TRANFORM_OPTIONS),
      ),
      pageMetaDto,
    );
  }

  async create(
    context: Context,
    { projectId, ...input }: CreateLocationDto,
  ): Promise<LocationDto> {
    const entry = await this.prisma.location.create({
      data: {
        ...input,
        project: createConnectObject(projectId),
        createdBy: input.createdBy as Prisma.InputJsonValue,
        updatedBy: input.createdBy as Prisma.InputJsonValue,
      },
    });
    const dto = plainToInstance(
      LocationDto,
      entry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.set(LocationService.generateCacheId(entry), dto);

    this.eventsService.emitEvent({
      projectId,
      entity: LocationEntities.LOCATION,
      entityId: LocationService.generateEntityId(entry),
      eventName: LocationEvents.LOCATION_CREATED,
      event: new LocationCreatedEvent(),
      action: EventAction.CREATE,
      after: dto,
    });

    return dto;
  }

  async update(
    context: Context,
    { id, projectId, updatedBy, ...data }: UpdateLocationDto,
  ): Promise<LocationDto> {
    const entry = await this.findOneById(context, { projectId, id });
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.location.update({
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
      LocationDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.set(LocationService.generateCacheId(dto), dto);

    this.eventsService.emitEvent({
      projectId,
      entity: LocationEntities.LOCATION,
      entityId: LocationService.generateEntityId(updatedEntry),
      eventName: LocationEvents.LOCATION_UPDATED,
      event: new LocationUpdatedEvent(),
      action: EventAction.UPDATE,
      before: entry,
      after: dto,
    });

    return dto;
  }

  async delete(
    context: Context,
    input: DeleteLocationDto,
  ): Promise<LocationDto> {
    const { id, projectId, deletedBy } = input;

    const entry = await this.findOneById(context, { projectId, id });
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.location.update({
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
      LocationDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.del(LocationService.generateCacheId(dto));

    this.eventsService.emitEvent({
      projectId,
      entity: LocationEntities.LOCATION,
      entityId: LocationService.generateEntityId(updatedEntry),
      eventName: LocationEvents.LOCATION_DELETED,
      event: new LocationDeletedEvent(),
      action: EventAction.DELETE,
      before: entry,
      after: dto,
    });

    return dto;
  }
}
