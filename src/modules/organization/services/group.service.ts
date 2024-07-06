import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma, Group } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

import { EventsService, CacheService, PrismaService } from '@modules/core';
import {
  CreateGroupDto,
  UpdateGroupDto,
  DeleteGroupDto,
  GroupCreatedEvent,
  GroupUpdatedEvent,
  GroupDeletedEvent,
  OrganizationEvents,
  GroupDto,
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
export class GroupService {
  private readonly logger = new Logger(GroupService.name);

  static generateCacheId({ projectId, id }: GenerateCacheIdParams) {
    return `Project-${projectId}/Group-${id}/ID`;
  }

  static generateEntityId(entry: Group) {
    return `Project-${entry.projectId}/Group-${entry.id}`;
  }

  constructor(
    private readonly cacheService: CacheService<GroupDto>,
    private readonly prisma: PrismaService,
    private readonly eventsService: EventsService<GroupDto>,
  ) {}

  async findOneById(
    context: Context,
    { projectId, id }: FindOneByIdParams,
  ): Promise<GroupDto | null> {
    const cachedData = await this.cacheService.get(
      GroupService.generateCacheId({ projectId, id }),
    );
    if (cachedData) {
      return plainToInstance(
        GroupDto,
        cachedData,
        DEFAULT_CLASS_TRANFORM_OPTIONS,
      );
    }

    const entry = await this.prisma.group.findUnique({
      where: {
        id,
        projectId,
        deletedAt: null,
      },
    });
    const dto = plainToInstance(
      GroupDto,
      entry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    if (!!dto) {
      await this.cacheService.set(GroupService.generateCacheId(dto), dto);
    }

    return dto;
  }

  async findAll(
    context: Context,
    pageOptionsDto: PageOptionsDto,
    filters: Prisma.GroupWhereInput = {},
  ): Promise<PageDto<GroupDto>> {
    const [entries, total] = await Promise.all([
      this.prisma.group.findMany({
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
      this.prisma.group.count({
        where: {
          ...filters,
          deletedAt: null,
        },
      }),
    ]);

    const pageMetaDto = new PageMetaDto({ total, pageOptionsDto });

    return new PageDto(
      entries.map((entry) =>
        plainToInstance(GroupDto, entry, DEFAULT_CLASS_TRANFORM_OPTIONS),
      ),
      pageMetaDto,
    );
  }

  async create(
    context: Context,
    { projectId, ...input }: CreateGroupDto,
  ): Promise<GroupDto> {
    const entry = await this.prisma.group.create({
      data: {
        ...input,
        projectId,
        createdBy: input.createdBy as Prisma.InputJsonValue,
        updatedBy: input.createdBy as Prisma.InputJsonValue,
      },
    });
    const dto = plainToInstance(
      GroupDto,
      entry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.set(GroupService.generateCacheId(entry), dto);

    this.eventsService.emitEvent({
      projectId,
      entity: OrganizationEntities.GROUP,
      entityId: GroupService.generateEntityId(entry),
      eventName: OrganizationEvents.GROUP_CREATED,
      event: new GroupCreatedEvent(),
      action: EventAction.CREATE,
      after: dto,
    });

    return dto;
  }

  async update(
    context: Context,
    { id, projectId, updatedBy, ...data }: UpdateGroupDto,
  ): Promise<GroupDto> {
    const entry = await this.findOneById(context, { projectId, id });
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.group.update({
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
      GroupDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.set(GroupService.generateCacheId(dto), dto);

    this.eventsService.emitEvent({
      projectId,
      entity: OrganizationEntities.GROUP,
      entityId: GroupService.generateEntityId(updatedEntry),
      eventName: OrganizationEvents.GROUP_UPDATED,
      event: new GroupUpdatedEvent(),
      action: EventAction.UPDATE,
      before: entry,
      after: dto,
    });

    return dto;
  }

  async delete(context: Context, input: DeleteGroupDto): Promise<GroupDto> {
    const { id, projectId, deletedBy } = input;

    const entry = await this.findOneById(context, { projectId, id });
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.group.update({
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
      GroupDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.del(GroupService.generateCacheId(dto));

    this.eventsService.emitEvent({
      projectId,
      entity: OrganizationEntities.GROUP,
      entityId: GroupService.generateEntityId(updatedEntry),
      eventName: OrganizationEvents.GROUP_DELETED,
      event: new GroupDeletedEvent(),
      action: EventAction.DELETE,
      before: entry,
      after: dto,
    });

    return dto;
  }
}
