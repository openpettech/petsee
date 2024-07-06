import { Injectable, Logger } from '@nestjs/common';
import { Prisma, StockLedger } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

import { EventsService, CacheService, PrismaService } from '@modules/core';
import {
  StockLedgerTransactionDto,
  StockLedgerCreatedEvent,
  InventoryEvents,
  StockLedgerDto,
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
export class StockLedgerService {
  private readonly logger = new Logger(StockLedgerService.name);

  static generateCacheId({ projectId, id }: GenerateCacheIdParams) {
    return `Project-${projectId}/StockLedger-${id}/ID`;
  }

  static generateEntityId(entry: StockLedger) {
    return `Project-${entry.projectId}/StockLedger-${entry.id}`;
  }

  constructor(
    private readonly cacheService: CacheService<StockLedgerDto>,
    private readonly prisma: PrismaService,
    private readonly eventsService: EventsService<StockLedgerDto>,
  ) {}

  async findOneById(
    context: Context,
    { projectId, id }: FindOneByIdParams,
  ): Promise<StockLedgerDto | null> {
    const cachedData = await this.cacheService.get(
      StockLedgerService.generateCacheId({ projectId, id }),
    );
    if (cachedData) {
      return plainToInstance(
        StockLedgerDto,
        cachedData,
        DEFAULT_CLASS_TRANFORM_OPTIONS,
      );
    }

    const entry = await this.prisma.stockLedger.findUnique({
      where: {
        id,
        projectId,
        deletedAt: null,
      },
    });
    const dto = plainToInstance(
      StockLedgerDto,
      entry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    if (!!dto) {
      await this.cacheService.set(StockLedgerService.generateCacheId(dto), dto);
    }

    return dto;
  }

  async findAll(
    context: Context,
    pageOptionsDto: PageOptionsDto,
    filters: Prisma.StockLedgerWhereInput = {},
  ): Promise<PageDto<StockLedgerDto>> {
    const [entries, total] = await Promise.all([
      this.prisma.stockLedger.findMany({
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
      this.prisma.stockLedger.count({
        where: {
          ...filters,
          deletedAt: null,
        },
      }),
    ]);

    const pageMetaDto = new PageMetaDto({ total, pageOptionsDto });

    return new PageDto(
      entries.map((entry) =>
        plainToInstance(StockLedgerDto, entry, DEFAULT_CLASS_TRANFORM_OPTIONS),
      ),
      pageMetaDto,
    );
  }

  async transaction(
    context: Context,
    { projectId, ...input }: StockLedgerTransactionDto,
  ): Promise<StockLedgerDto> {
    const entry = await this.prisma.stockLedger.create({
      data: {
        ...input,
        projectId,
        createdBy: input.createdBy as Prisma.InputJsonValue,
        updatedBy: input.createdBy as Prisma.InputJsonValue,
      },
    });
    const dto = plainToInstance(
      StockLedgerDto,
      entry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.set(StockLedgerService.generateCacheId(entry), dto);

    this.eventsService.emitEvent({
      projectId,
      entity: InventoryEntities.STOCK_LEDGER,
      entityId: StockLedgerService.generateEntityId(entry),
      eventName: InventoryEvents.STOCK_LEDGER_CREATED,
      event: new StockLedgerCreatedEvent(),
      action: EventAction.CREATE,
      after: dto,
    });

    return dto;
  }
}
