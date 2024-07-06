import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma, Stock } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

import { EventsService, CacheService, PrismaService } from '@modules/core';
import {
  CreateStockDto,
  UpdateStockDto,
  DeleteStockDto,
  StockCreatedEvent,
  StockUpdatedEvent,
  StockDeletedEvent,
  InventoryEvents,
  StockDto,
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
export class StockService {
  private readonly logger = new Logger(StockService.name);

  static generateCacheId({ projectId, id }: GenerateCacheIdParams) {
    return `Project-${projectId}/Stock-${id}/ID`;
  }

  static generateEntityId(entry: Stock) {
    return `Project-${entry.projectId}/Stock-${entry.id}`;
  }

  constructor(
    private readonly cacheService: CacheService<StockDto>,
    private readonly prisma: PrismaService,
    private readonly eventsService: EventsService<StockDto>,
  ) {}

  async findOneById(
    context: Context,
    { projectId, id }: FindOneByIdParams,
  ): Promise<StockDto | null> {
    const cachedData = await this.cacheService.get(
      StockService.generateCacheId({ projectId, id }),
    );
    if (cachedData) {
      return plainToInstance(
        StockDto,
        cachedData,
        DEFAULT_CLASS_TRANFORM_OPTIONS,
      );
    }

    const entry = await this.prisma.stock.findUnique({
      where: {
        id,
        projectId,
        deletedAt: null,
      },
    });
    const dto = plainToInstance(
      StockDto,
      entry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    if (!!dto) {
      await this.cacheService.set(StockService.generateCacheId(dto), dto);
    }

    return dto;
  }

  async findAll(
    context: Context,
    pageOptionsDto: PageOptionsDto,
    filters: Prisma.StockWhereInput = {},
  ): Promise<PageDto<StockDto>> {
    const [entries, total] = await Promise.all([
      this.prisma.stock.findMany({
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
      this.prisma.stock.count({
        where: {
          ...filters,
          deletedAt: null,
        },
      }),
    ]);

    const pageMetaDto = new PageMetaDto({ total, pageOptionsDto });

    return new PageDto(
      entries.map((entry) =>
        plainToInstance(StockDto, entry, DEFAULT_CLASS_TRANFORM_OPTIONS),
      ),
      pageMetaDto,
    );
  }

  async create(
    context: Context,
    { projectId, ...input }: CreateStockDto,
  ): Promise<StockDto> {
    const entry = await this.prisma.stock.create({
      data: {
        ...input,
        projectId,
        createdBy: input.createdBy as Prisma.InputJsonValue,
        updatedBy: input.createdBy as Prisma.InputJsonValue,
      },
    });
    const dto = plainToInstance(
      StockDto,
      entry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.set(StockService.generateCacheId(entry), dto);

    this.eventsService.emitEvent({
      projectId,
      entity: InventoryEntities.STOCK,
      entityId: StockService.generateEntityId(entry),
      eventName: InventoryEvents.STOCK_CREATED,
      event: new StockCreatedEvent(),
      action: EventAction.CREATE,
      after: dto,
    });

    return dto;
  }

  async update(
    context: Context,
    { id, projectId, updatedBy, ...data }: UpdateStockDto,
  ): Promise<StockDto> {
    const entry = await this.findOneById(context, { projectId, id });
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.stock.update({
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
      StockDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.set(StockService.generateCacheId(dto), dto);

    this.eventsService.emitEvent({
      projectId,
      entity: InventoryEntities.STOCK,
      entityId: StockService.generateEntityId(updatedEntry),
      eventName: InventoryEvents.STOCK_UPDATED,
      event: new StockUpdatedEvent(),
      action: EventAction.UPDATE,
      before: entry,
      after: dto,
    });

    return dto;
  }

  async delete(context: Context, input: DeleteStockDto): Promise<StockDto> {
    const { id, projectId, deletedBy } = input;

    const entry = await this.findOneById(context, { projectId, id });
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.stock.update({
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
      StockDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.del(StockService.generateCacheId(dto));

    this.eventsService.emitEvent({
      projectId,
      entity: InventoryEntities.STOCK,
      entityId: StockService.generateEntityId(updatedEntry),
      eventName: InventoryEvents.STOCK_DELETED,
      event: new StockDeletedEvent(),
      action: EventAction.DELETE,
      before: entry,
      after: dto,
    });

    return dto;
  }
}
