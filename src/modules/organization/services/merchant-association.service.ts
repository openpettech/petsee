import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, MerchantAssociation } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

import { EventsService, CacheService, PrismaService } from '@modules/core';
import {
  CreateMerchantAssociationDto,
  UpdateMerchantAssociationDto,
  DeleteMerchantAssociationDto,
  MerchantAssociationCreatedEvent,
  MerchantAssociationUpdatedEvent,
  MerchantAssociationDeletedEvent,
  OrganizationEvents,
  MerchantAssociationDto,
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
export class MerchantAssociationService {
  private readonly logger = new Logger(MerchantAssociationService.name);

  static generateCacheId({ projectId, id }: GenerateCacheIdParams) {
    return `Project-${projectId}/MerchantAssociation-${id}/ID`;
  }

  static generateEntityId(entry: MerchantAssociation) {
    return `Project-${entry.projectId}/MerchantAssociation-${entry.id}`;
  }

  constructor(
    private readonly cacheService: CacheService<MerchantAssociationDto>,
    private readonly prisma: PrismaService,
    private readonly eventsService: EventsService<MerchantAssociationDto>,
  ) {}

  async findOneById(
    context: Context,
    { projectId, id }: FindOneByIdParams,
  ): Promise<MerchantAssociationDto | null> {
    const cachedData = await this.cacheService.get(
      MerchantAssociationService.generateCacheId({ projectId, id }),
    );
    if (cachedData) {
      return plainToInstance(
        MerchantAssociationDto,
        cachedData,
        DEFAULT_CLASS_TRANFORM_OPTIONS,
      );
    }

    const entry = await this.prisma.merchantAssociation.findUnique({
      where: {
        id,
        projectId,
        deletedAt: null,
      },
    });
    const dto = plainToInstance(
      MerchantAssociationDto,
      entry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    if (!!dto) {
      await this.cacheService.set(
        MerchantAssociationService.generateCacheId(dto),
        dto,
      );
    }

    return dto;
  }

  async findAll(
    context: Context,
    pageOptionsDto: PageOptionsDto,
    filters: Prisma.MerchantAssociationWhereInput = {},
  ): Promise<PageDto<MerchantAssociationDto>> {
    const [entries, total] = await Promise.all([
      this.prisma.merchantAssociation.findMany({
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
      this.prisma.merchantAssociation.count({
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
          MerchantAssociationDto,
          entry,
          DEFAULT_CLASS_TRANFORM_OPTIONS,
        ),
      ),
      pageMetaDto,
    );
  }

  async create(
    context: Context,
    { projectId, ...input }: CreateMerchantAssociationDto,
  ): Promise<MerchantAssociationDto> {
    const existing = await this.prisma.merchantAssociation.findFirst({
      where: {
        projectId,
        merchantId: input.merchantId,
        facilityId: input.facilityId,
      },
    });
    if (!!existing) {
      throw new BadRequestException('Association already exist for this pair');
    }

    const entry = await this.prisma.merchantAssociation.create({
      data: {
        ...input,
        projectId,
        createdBy: input.createdBy as Prisma.InputJsonValue,
        updatedBy: input.createdBy as Prisma.InputJsonValue,
      },
    });
    const dto = plainToInstance(
      MerchantAssociationDto,
      entry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.set(
      MerchantAssociationService.generateCacheId(entry),
      dto,
    );

    this.eventsService.emitEvent({
      projectId,
      entity: OrganizationEntities.MERCHANT_ASSOCIATION,
      entityId: MerchantAssociationService.generateEntityId(entry),
      eventName: OrganizationEvents.MERCHANT_ASSOCIATION_CREATED,
      event: new MerchantAssociationCreatedEvent(),
      action: EventAction.CREATE,
      after: dto,
    });

    return dto;
  }

  async update(
    context: Context,
    { id, projectId, updatedBy, ...data }: UpdateMerchantAssociationDto,
  ): Promise<MerchantAssociationDto> {
    const entry = await this.findOneById(context, { projectId, id });
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.merchantAssociation.update({
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
      MerchantAssociationDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.set(
      MerchantAssociationService.generateCacheId(dto),
      dto,
    );

    this.eventsService.emitEvent({
      projectId,
      entity: OrganizationEntities.MERCHANT_ASSOCIATION,
      entityId: MerchantAssociationService.generateEntityId(updatedEntry),
      eventName: OrganizationEvents.MERCHANT_ASSOCIATION_UPDATED,
      event: new MerchantAssociationUpdatedEvent(),
      action: EventAction.UPDATE,
      before: entry,
      after: dto,
    });

    return dto;
  }

  async delete(
    context: Context,
    input: DeleteMerchantAssociationDto,
  ): Promise<MerchantAssociationDto> {
    const { id, projectId, deletedBy } = input;

    const entry = await this.findOneById(context, { projectId, id });
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.merchantAssociation.update({
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
      MerchantAssociationDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.del(
      MerchantAssociationService.generateCacheId(dto),
    );

    this.eventsService.emitEvent({
      projectId,
      entity: OrganizationEntities.MERCHANT_ASSOCIATION,
      entityId: MerchantAssociationService.generateEntityId(updatedEntry),
      eventName: OrganizationEvents.MERCHANT_ASSOCIATION_DELETED,
      event: new MerchantAssociationDeletedEvent(),
      action: EventAction.DELETE,
      before: entry,
      after: dto,
    });

    return dto;
  }
}
