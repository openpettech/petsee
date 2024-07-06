import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma, Merchant } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

import { EventsService, CacheService, PrismaService } from '@modules/core';
import {
  CreateMerchantDto,
  UpdateMerchantDto,
  DeleteMerchantDto,
  MerchantCreatedEvent,
  MerchantUpdatedEvent,
  MerchantDeletedEvent,
  OrganizationEvents,
  MerchantDto,
  OrganizationEntities,
} from '@contracts/organization';
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
export class MerchantService {
  private readonly logger = new Logger(MerchantService.name);

  static generateCacheId({ projectId, id }: GenerateCacheIdParams) {
    return `Project-${projectId}/Merchant-${id}/ID`;
  }

  static generateEntityId(entry: Merchant) {
    return `Project-${entry.projectId}/Merchant-${entry.id}`;
  }

  constructor(
    private readonly cacheService: CacheService<MerchantDto>,
    private readonly prisma: PrismaService,
    private readonly eventsService: EventsService<MerchantDto>,
  ) {}

  async findOneById(
    context: Context,
    { projectId, id }: FindOneByIdParams,
  ): Promise<MerchantDto | null> {
    const cachedData = await this.cacheService.get(
      MerchantService.generateCacheId({ projectId, id }),
    );
    if (cachedData) {
      return plainToInstance(
        MerchantDto,
        cachedData,
        DEFAULT_CLASS_TRANFORM_OPTIONS,
      );
    }

    const entry = await this.prisma.merchant.findUnique({
      where: {
        id,
        projectId,
        deletedAt: null,
      },
    });
    const dto = plainToInstance(
      MerchantDto,
      entry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    if (!!dto) {
      await this.cacheService.set(MerchantService.generateCacheId(dto), dto);
    }

    return dto;
  }

  async findAll(
    context: Context,
    pageOptionsDto: PageOptionsDto,
    filters: Prisma.MerchantWhereInput = {},
  ): Promise<PageDto<MerchantDto>> {
    const [entries, total] = await Promise.all([
      this.prisma.merchant.findMany({
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
      this.prisma.merchant.count({
        where: {
          ...filters,
          deletedAt: null,
        },
      }),
    ]);

    const pageMetaDto = new PageMetaDto({ total, pageOptionsDto });

    return new PageDto(
      entries.map((entry) =>
        plainToInstance(MerchantDto, entry, DEFAULT_CLASS_TRANFORM_OPTIONS),
      ),
      pageMetaDto,
    );
  }

  async create(
    context: Context,
    { projectId, ...input }: CreateMerchantDto,
  ): Promise<MerchantDto> {
    const entry = await this.prisma.merchant.create({
      data: {
        ...input,
        projectId,
        createdBy: input.createdBy as Prisma.InputJsonValue,
        updatedBy: input.createdBy as Prisma.InputJsonValue,
      },
    });
    const dto = plainToInstance(
      MerchantDto,
      entry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.set(MerchantService.generateCacheId(entry), dto);

    this.eventsService.emitEvent({
      projectId,
      entity: OrganizationEntities.MERCHANT,
      entityId: MerchantService.generateEntityId(entry),
      eventName: OrganizationEvents.MERCHANT_CREATED,
      event: new MerchantCreatedEvent(),
      action: EventAction.CREATE,
      after: dto,
    });

    return dto;
  }

  async update(
    context: Context,
    { id, projectId, updatedBy, ...data }: UpdateMerchantDto,
  ): Promise<MerchantDto> {
    const entry = await this.findOneById(context, { projectId, id });
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.merchant.update({
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
      MerchantDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.set(MerchantService.generateCacheId(dto), dto);

    this.eventsService.emitEvent({
      projectId,
      entity: OrganizationEntities.MERCHANT,
      entityId: MerchantService.generateEntityId(updatedEntry),
      eventName: OrganizationEvents.MERCHANT_UPDATED,
      event: new MerchantUpdatedEvent(),
      action: EventAction.UPDATE,
      before: entry,
      after: dto,
    });

    return dto;
  }

  async delete(
    context: Context,
    input: DeleteMerchantDto,
  ): Promise<MerchantDto> {
    const { id, projectId, deletedBy } = input;

    const entry = await this.findOneById(context, { projectId, id });
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.merchant.update({
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
      MerchantDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.del(MerchantService.generateCacheId(dto));

    this.eventsService.emitEvent({
      projectId,
      entity: OrganizationEntities.MERCHANT,
      entityId: MerchantService.generateEntityId(updatedEntry),
      eventName: OrganizationEvents.MERCHANT_DELETED,
      event: new MerchantDeletedEvent(),
      action: EventAction.DELETE,
      before: entry,
      after: dto,
    });

    return dto;
  }
}
