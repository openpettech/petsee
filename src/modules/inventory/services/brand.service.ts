import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma, Brand } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

import { EventsService, CacheService, PrismaService } from '@modules/core';
import {
  CreateBrandDto,
  UpdateBrandDto,
  DeleteBrandDto,
  BrandCreatedEvent,
  BrandUpdatedEvent,
  BrandDeletedEvent,
  InventoryEvents,
  BrandDto,
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
export class BrandService {
  private readonly logger = new Logger(BrandService.name);

  static generateCacheId({ projectId, id }: GenerateCacheIdParams) {
    return `Project-${projectId}/Brand-${id}/ID`;
  }

  static generateEntityId(entry: Brand) {
    return `Project-${entry.projectId}/Brand-${entry.id}`;
  }

  constructor(
    private readonly cacheService: CacheService<BrandDto>,
    private readonly prisma: PrismaService,
    private readonly eventsService: EventsService<BrandDto>,
  ) {}

  async findOneById(
    context: Context,
    { projectId, id }: FindOneByIdParams,
  ): Promise<BrandDto | null> {
    const cachedData = await this.cacheService.get(
      BrandService.generateCacheId({ projectId, id }),
    );
    if (cachedData) {
      return plainToInstance(
        BrandDto,
        cachedData,
        DEFAULT_CLASS_TRANFORM_OPTIONS,
      );
    }

    const entry = await this.prisma.brand.findUnique({
      where: {
        id,
        projectId,
        deletedAt: null,
      },
    });
    const dto = plainToInstance(
      BrandDto,
      entry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    if (!!dto) {
      await this.cacheService.set(BrandService.generateCacheId(dto), dto);
    }

    return dto;
  }

  async findAll(
    context: Context,
    pageOptionsDto: PageOptionsDto,
    filters: Prisma.BrandWhereInput = {},
  ): Promise<PageDto<BrandDto>> {
    const [entries, total] = await Promise.all([
      this.prisma.brand.findMany({
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
      this.prisma.brand.count({
        where: {
          ...filters,
          deletedAt: null,
        },
      }),
    ]);

    const pageMetaDto = new PageMetaDto({ total, pageOptionsDto });

    return new PageDto(
      entries.map((entry) =>
        plainToInstance(BrandDto, entry, DEFAULT_CLASS_TRANFORM_OPTIONS),
      ),
      pageMetaDto,
    );
  }

  async create(
    context: Context,
    { projectId, ...input }: CreateBrandDto,
  ): Promise<BrandDto> {
    const entry = await this.prisma.brand.create({
      data: {
        ...input,
        projectId,
        createdBy: input.createdBy as Prisma.InputJsonValue,
        updatedBy: input.createdBy as Prisma.InputJsonValue,
      },
    });
    const dto = plainToInstance(
      BrandDto,
      entry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.set(BrandService.generateCacheId(entry), dto);

    this.eventsService.emitEvent({
      projectId,
      entity: InventoryEntities.BRAND,
      entityId: BrandService.generateEntityId(entry),
      eventName: InventoryEvents.BRAND_CREATED,
      event: new BrandCreatedEvent(),
      action: EventAction.CREATE,
      after: dto,
    });

    return dto;
  }

  async update(
    context: Context,
    { id, projectId, updatedBy, ...data }: UpdateBrandDto,
  ): Promise<BrandDto> {
    const entry = await this.findOneById(context, { projectId, id });
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.brand.update({
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
      BrandDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.set(BrandService.generateCacheId(dto), dto);

    this.eventsService.emitEvent({
      projectId,
      entity: InventoryEntities.BRAND,
      entityId: BrandService.generateEntityId(updatedEntry),
      eventName: InventoryEvents.BRAND_UPDATED,
      event: new BrandUpdatedEvent(),
      action: EventAction.UPDATE,
      before: entry,
      after: dto,
    });

    return dto;
  }

  async delete(context: Context, input: DeleteBrandDto): Promise<BrandDto> {
    const { id, projectId, deletedBy } = input;

    const entry = await this.findOneById(context, { projectId, id });
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.brand.update({
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
      BrandDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.del(BrandService.generateCacheId(dto));

    this.eventsService.emitEvent({
      projectId,
      entity: InventoryEntities.BRAND,
      entityId: BrandService.generateEntityId(updatedEntry),
      eventName: InventoryEvents.BRAND_DELETED,
      event: new BrandDeletedEvent(),
      action: EventAction.DELETE,
      before: entry,
      after: dto,
    });

    return dto;
  }
}
