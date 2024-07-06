import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, GroupAssociation } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

import { EventsService, CacheService, PrismaService } from '@modules/core';
import {
  CreateGroupAssociationDto,
  UpdateGroupAssociationDto,
  DeleteGroupAssociationDto,
  GroupAssociationCreatedEvent,
  GroupAssociationUpdatedEvent,
  GroupAssociationDeletedEvent,
  OrganizationEvents,
  GroupAssociationDto,
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
export class GroupAssociationService {
  private readonly logger = new Logger(GroupAssociationService.name);

  static generateCacheId({ projectId, id }: GenerateCacheIdParams) {
    return `Project-${projectId}/GroupAssociation-${id}/ID`;
  }

  static generateEntityId(entry: GroupAssociation) {
    return `Project-${entry.projectId}/GroupAssociation-${entry.id}`;
  }

  constructor(
    private readonly cacheService: CacheService<GroupAssociationDto>,
    private readonly prisma: PrismaService,
    private readonly eventsService: EventsService<GroupAssociationDto>,
  ) {}

  async findOneById(
    context: Context,
    { projectId, id }: FindOneByIdParams,
  ): Promise<GroupAssociationDto | null> {
    const cachedData = await this.cacheService.get(
      GroupAssociationService.generateCacheId({ projectId, id }),
    );
    if (cachedData) {
      return plainToInstance(
        GroupAssociationDto,
        cachedData,
        DEFAULT_CLASS_TRANFORM_OPTIONS,
      );
    }

    const entry = await this.prisma.groupAssociation.findUnique({
      where: {
        id,
        projectId,
        deletedAt: null,
      },
    });
    const dto = plainToInstance(
      GroupAssociationDto,
      entry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    if (!!dto) {
      await this.cacheService.set(
        GroupAssociationService.generateCacheId(dto),
        dto,
      );
    }

    return dto;
  }

  async findAll(
    context: Context,
    pageOptionsDto: PageOptionsDto,
    filters: Prisma.GroupAssociationWhereInput = {},
  ): Promise<PageDto<GroupAssociationDto>> {
    const [entries, total] = await Promise.all([
      this.prisma.groupAssociation.findMany({
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
      this.prisma.groupAssociation.count({
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
          GroupAssociationDto,
          entry,
          DEFAULT_CLASS_TRANFORM_OPTIONS,
        ),
      ),
      pageMetaDto,
    );
  }

  async create(
    context: Context,
    { projectId, ...input }: CreateGroupAssociationDto,
  ): Promise<GroupAssociationDto> {
    const existing = await this.prisma.groupAssociation.findFirst({
      where: {
        projectId,
        groupId: input.groupId,
        merchantId: input.merchantId,
      },
    });
    if (!!existing) {
      throw new BadRequestException('Association already exist for this pair');
    }

    const entry = await this.prisma.groupAssociation.create({
      data: {
        ...input,
        projectId,
        createdBy: input.createdBy as Prisma.InputJsonValue,
        updatedBy: input.createdBy as Prisma.InputJsonValue,
      },
    });
    const dto = plainToInstance(
      GroupAssociationDto,
      entry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.set(
      GroupAssociationService.generateCacheId(entry),
      dto,
    );

    this.eventsService.emitEvent({
      projectId,
      entity: OrganizationEntities.GROUP_ASSOCIATION,
      entityId: GroupAssociationService.generateEntityId(entry),
      eventName: OrganizationEvents.GROUP_ASSOCIATION_CREATED,
      event: new GroupAssociationCreatedEvent(),
      action: EventAction.CREATE,
      after: dto,
    });

    return dto;
  }

  async update(
    context: Context,
    { id, projectId, updatedBy, ...data }: UpdateGroupAssociationDto,
  ): Promise<GroupAssociationDto> {
    const entry = await this.findOneById(context, { projectId, id });
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.groupAssociation.update({
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
      GroupAssociationDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.set(
      GroupAssociationService.generateCacheId(dto),
      dto,
    );

    this.eventsService.emitEvent({
      projectId,
      entity: OrganizationEntities.GROUP_ASSOCIATION,
      entityId: GroupAssociationService.generateEntityId(updatedEntry),
      eventName: OrganizationEvents.GROUP_ASSOCIATION_UPDATED,
      event: new GroupAssociationUpdatedEvent(),
      action: EventAction.UPDATE,
      before: entry,
      after: dto,
    });

    return dto;
  }

  async delete(
    context: Context,
    input: DeleteGroupAssociationDto,
  ): Promise<GroupAssociationDto> {
    const { id, projectId, deletedBy } = input;

    const entry = await this.findOneById(context, { projectId, id });
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.groupAssociation.update({
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
      GroupAssociationDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.del(GroupAssociationService.generateCacheId(dto));

    this.eventsService.emitEvent({
      projectId,
      entity: OrganizationEntities.GROUP_ASSOCIATION,
      entityId: GroupAssociationService.generateEntityId(updatedEntry),
      eventName: OrganizationEvents.GROUP_ASSOCIATION_DELETED,
      event: new GroupAssociationDeletedEvent(),
      action: EventAction.DELETE,
      before: entry,
      after: dto,
    });

    return dto;
  }
}
