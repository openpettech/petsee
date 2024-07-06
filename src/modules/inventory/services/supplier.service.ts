import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma, Supplier } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

import { EventsService, CacheService, PrismaService } from '@modules/core';
import {
  CreateSupplierDto,
  UpdateSupplierDto,
  DeleteSupplierDto,
  SupplierCreatedEvent,
  SupplierUpdatedEvent,
  SupplierDeletedEvent,
  InventoryEvents,
  SupplierDto,
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
export class SupplierService {
  private readonly logger = new Logger(SupplierService.name);

  static generateCacheId({ projectId, id }: GenerateCacheIdParams) {
    return `Project-${projectId}/Supplier-${id}/ID`;
  }

  static generateEntityId(entry: Supplier) {
    return `Project-${entry.projectId}/Supplier-${entry.id}`;
  }

  constructor(
    private readonly cacheService: CacheService<SupplierDto>,
    private readonly prisma: PrismaService,
    private readonly eventsService: EventsService<SupplierDto>,
  ) {}

  async findOneById(
    context: Context,
    { projectId, id }: FindOneByIdParams,
  ): Promise<SupplierDto | null> {
    const cachedData = await this.cacheService.get(
      SupplierService.generateCacheId({ projectId, id }),
    );
    if (cachedData) {
      return plainToInstance(
        SupplierDto,
        cachedData,
        DEFAULT_CLASS_TRANFORM_OPTIONS,
      );
    }

    const entry = await this.prisma.supplier.findUnique({
      where: {
        id,
        projectId,
        deletedAt: null,
      },
    });
    const dto = plainToInstance(
      SupplierDto,
      entry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    if (!!dto) {
      await this.cacheService.set(SupplierService.generateCacheId(dto), dto);
    }

    return dto;
  }

  async findAll(
    context: Context,
    pageOptionsDto: PageOptionsDto,
    filters: Prisma.SupplierWhereInput = {},
  ): Promise<PageDto<SupplierDto>> {
    const [entries, total] = await Promise.all([
      this.prisma.supplier.findMany({
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
      this.prisma.supplier.count({
        where: {
          ...filters,
          deletedAt: null,
        },
      }),
    ]);

    const pageMetaDto = new PageMetaDto({ total, pageOptionsDto });

    return new PageDto(
      entries.map((entry) =>
        plainToInstance(SupplierDto, entry, DEFAULT_CLASS_TRANFORM_OPTIONS),
      ),
      pageMetaDto,
    );
  }

  async create(
    context: Context,
    { projectId, ...input }: CreateSupplierDto,
  ): Promise<SupplierDto> {
    const entry = await this.prisma.supplier.create({
      data: {
        ...input,
        projectId,
        createdBy: input.createdBy as Prisma.InputJsonValue,
        updatedBy: input.createdBy as Prisma.InputJsonValue,
      },
    });
    const dto = plainToInstance(
      SupplierDto,
      entry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.set(SupplierService.generateCacheId(entry), dto);

    this.eventsService.emitEvent({
      projectId,
      entity: InventoryEntities.SUPPLIER,
      entityId: SupplierService.generateEntityId(entry),
      eventName: InventoryEvents.SUPPLIER_CREATED,
      event: new SupplierCreatedEvent(),
      action: EventAction.CREATE,
      after: dto,
    });

    return dto;
  }

  async update(
    context: Context,
    { id, projectId, updatedBy, ...data }: UpdateSupplierDto,
  ): Promise<SupplierDto> {
    const entry = await this.findOneById(context, { projectId, id });
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.supplier.update({
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
      SupplierDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.set(SupplierService.generateCacheId(dto), dto);

    this.eventsService.emitEvent({
      projectId,
      entity: InventoryEntities.SUPPLIER,
      entityId: SupplierService.generateEntityId(updatedEntry),
      eventName: InventoryEvents.SUPPLIER_UPDATED,
      event: new SupplierUpdatedEvent(),
      action: EventAction.UPDATE,
      before: entry,
      after: dto,
    });

    return dto;
  }

  async delete(
    context: Context,
    input: DeleteSupplierDto,
  ): Promise<SupplierDto> {
    const { id, projectId, deletedBy } = input;

    const entry = await this.findOneById(context, { projectId, id });
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.supplier.update({
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
      SupplierDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.del(SupplierService.generateCacheId(dto));

    this.eventsService.emitEvent({
      projectId,
      entity: InventoryEntities.SUPPLIER,
      entityId: SupplierService.generateEntityId(updatedEntry),
      eventName: InventoryEvents.SUPPLIER_DELETED,
      event: new SupplierDeletedEvent(),
      action: EventAction.DELETE,
      before: entry,
      after: dto,
    });

    return dto;
  }
}
