import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma, Warehouse } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

import { EventsService, CacheService, PrismaService } from '@modules/core';
import {
  CreateWarehouseDto,
  UpdateWarehouseDto,
  DeleteWarehouseDto,
  WarehouseCreatedEvent,
  WarehouseUpdatedEvent,
  WarehouseDeletedEvent,
  InventoryEvents,
  WarehouseDto,
  InventoryEntities,
} from '@contracts/inventory';

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
export class WarehouseService {
  private readonly logger = new Logger(WarehouseService.name);

  static generateCacheId({ projectId, id }: GenerateCacheIdParams) {
    return `Project-${projectId}/Warehouse-${id}/ID`;
  }

  static generateEntityId(entry: Warehouse) {
    return `Project-${entry.projectId}/Warehouse-${entry.id}`;
  }

  constructor(
    private readonly cacheService: CacheService<WarehouseDto>,
    private readonly prisma: PrismaService,
    private readonly eventsService: EventsService<WarehouseDto>,
  ) {}

  async findOneById(
    context: Context,
    { projectId, id }: FindOneByIdParams,
  ): Promise<WarehouseDto | null> {
    const cachedData = await this.cacheService.get(
      WarehouseService.generateCacheId({ projectId, id }),
    );
    if (cachedData) {
      return plainToInstance(
        WarehouseDto,
        cachedData,
        DEFAULT_CLASS_TRANFORM_OPTIONS,
      );
    }

    const entry = await this.prisma.warehouse.findUnique({
      where: {
        id,
        projectId,
        deletedAt: null,
      },
    });
    const dto = plainToInstance(
      WarehouseDto,
      entry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    if (!!dto) {
      await this.cacheService.set(WarehouseService.generateCacheId(dto), dto);
    }

    return dto;
  }

  async findAll(
    context: Context,
    pageOptionsDto: PageOptionsDto,
    filters: Prisma.WarehouseWhereInput = {},
  ): Promise<PageDto<WarehouseDto>> {
    const [entries, total] = await Promise.all([
      this.prisma.warehouse.findMany({
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
      this.prisma.warehouse.count({
        where: {
          ...filters,
          deletedAt: null,
        },
      }),
    ]);

    const pageMetaDto = new PageMetaDto({ total, pageOptionsDto });

    return new PageDto(
      entries.map((entry) =>
        plainToInstance(WarehouseDto, entry, DEFAULT_CLASS_TRANFORM_OPTIONS),
      ),
      pageMetaDto,
    );
  }

  async create(
    context: Context,
    { projectId, ...input }: CreateWarehouseDto,
  ): Promise<WarehouseDto> {
    const entry = await this.prisma.warehouse.create({
      data: {
        ...input,
        projectId,
        createdBy: input.createdBy as Prisma.InputJsonValue,
        updatedBy: input.createdBy as Prisma.InputJsonValue,
      },
    });
    const dto = plainToInstance(
      WarehouseDto,
      entry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.set(WarehouseService.generateCacheId(entry), dto);

    this.eventsService.emitEvent({
      projectId,
      entity: InventoryEntities.WAREHOUSE,
      entityId: WarehouseService.generateEntityId(entry),
      eventName: InventoryEvents.WAREHOUSE_CREATED,
      event: new WarehouseCreatedEvent(),
      action: EventAction.CREATE,
      after: dto,
    });

    return dto;
  }

  async update(
    context: Context,
    { id, projectId, updatedBy, ...data }: UpdateWarehouseDto,
  ): Promise<WarehouseDto> {
    const entry = await this.findOneById(context, { projectId, id });
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.warehouse.update({
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
      WarehouseDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.set(WarehouseService.generateCacheId(dto), dto);

    this.eventsService.emitEvent({
      projectId,
      entity: InventoryEntities.WAREHOUSE,
      entityId: WarehouseService.generateEntityId(updatedEntry),
      eventName: InventoryEvents.WAREHOUSE_UPDATED,
      event: new WarehouseUpdatedEvent(),
      action: EventAction.UPDATE,
      before: entry,
      after: dto,
    });

    return dto;
  }

  async delete(
    context: Context,
    input: DeleteWarehouseDto,
  ): Promise<WarehouseDto> {
    const { id, projectId, deletedBy } = input;

    const entry = await this.findOneById(context, { projectId, id });
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.warehouse.update({
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
      WarehouseDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.del(WarehouseService.generateCacheId(dto));

    this.eventsService.emitEvent({
      projectId,
      entity: InventoryEntities.WAREHOUSE,
      entityId: WarehouseService.generateEntityId(updatedEntry),
      eventName: InventoryEvents.WAREHOUSE_DELETED,
      event: new WarehouseDeletedEvent(),
      action: EventAction.DELETE,
      before: entry,
      after: dto,
    });

    return dto;
  }
}
