import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma, Project } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

import { EventsService, CacheService, PrismaService } from '@modules/core';
import {
  CreateProjectDto,
  UpdateProjectDto,
  DeleteProjectDto,
  ProjectCreatedEvent,
  ProjectUpdatedEvent,
  ProjectDeletedEvent,
  ProjectEvents,
  ProjectDto,
  ProjectEntities,
} from '@contracts/project';
import {
  Context,
  PageDto,
  PageMetaDto,
  PageOptionsDto,
} from '@contracts/common';
import { EventAction } from '@contracts/events';

@Injectable()
export class ProjectService {
  private readonly logger = new Logger(ProjectService.name);

  static generateCacheId(id: string) {
    return `Project-${id}/ID`;
  }

  static generateEntityId(entry: Project) {
    return `Project-${entry.id}`;
  }

  constructor(
    private readonly cacheService: CacheService<ProjectDto>,
    private readonly prisma: PrismaService,
    private readonly eventsService: EventsService<ProjectDto>,
  ) {}

  async findOneById(context: Context, id: string): Promise<ProjectDto | null> {
    const cachedData = await this.cacheService.get(
      ProjectService.generateCacheId(id),
    );
    if (cachedData) {
      return plainToInstance(ProjectDto, cachedData, {
        excludeExtraneousValues: true,
        exposeDefaultValues: true,
      });
    }

    const entry = await this.prisma.project.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });
    const dto = plainToInstance(ProjectDto, entry, {
      excludeExtraneousValues: true,
      exposeDefaultValues: true,
    });

    if (!!dto) {
      await this.cacheService.set(ProjectService.generateCacheId(id), dto);
    }

    return dto;
  }

  async findAll(
    context: Context,
    pageOptionsDto: PageOptionsDto,
    filters: Prisma.ProjectWhereInput = {},
  ): Promise<PageDto<ProjectDto>> {
    const [entries, total] = await Promise.all([
      this.prisma.project.findMany({
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
      this.prisma.project.count({
        where: {
          ...filters,
          deletedAt: null,
        },
      }),
    ]);

    const pageMetaDto = new PageMetaDto({ total, pageOptionsDto });

    return new PageDto(
      entries.map((entry) =>
        plainToInstance(ProjectDto, entry, {
          excludeExtraneousValues: true,
          exposeDefaultValues: true,
        }),
      ),
      pageMetaDto,
    );
  }

  async create(context: Context, input: CreateProjectDto): Promise<ProjectDto> {
    const entry = await this.prisma.project.create({
      data: {
        ...input,
        createdBy: input.createdBy as Prisma.InputJsonValue,
        updatedBy: input.createdBy as Prisma.InputJsonValue,
      },
    });
    const dto = plainToInstance(ProjectDto, entry, {
      excludeExtraneousValues: true,
      exposeDefaultValues: true,
    });

    await this.cacheService.set(ProjectService.generateCacheId(entry.id), dto);

    this.eventsService.emitEvent({
      entity: ProjectEntities.PROJECT,
      entityId: ProjectService.generateEntityId(entry),
      eventName: ProjectEvents.PROJECT_CREATED,
      event: new ProjectCreatedEvent(),
      action: EventAction.CREATE,
      after: dto,
    });

    return dto;
  }

  async update(
    context: Context,
    { id, updatedBy, ...data }: UpdateProjectDto,
  ): Promise<ProjectDto> {
    const entry = await this.findOneById(context, id);
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.project.update({
      where: {
        id,
        deletedAt: null,
      },
      data: {
        updatedBy: updatedBy as Prisma.InputJsonValue,
        ...data,
      },
    });
    const dto = plainToInstance(ProjectDto, updatedEntry, {
      excludeExtraneousValues: true,
      exposeDefaultValues: true,
    });

    await this.cacheService.set(ProjectService.generateCacheId(id), dto);

    this.eventsService.emitEvent({
      entity: ProjectEntities.PROJECT,
      entityId: ProjectService.generateEntityId(updatedEntry),
      eventName: ProjectEvents.PROJECT_UPDATED,
      event: new ProjectUpdatedEvent(),
      action: EventAction.UPDATE,
      before: entry,
      after: dto,
    });

    return dto;
  }

  async delete(context: Context, input: DeleteProjectDto): Promise<ProjectDto> {
    const { id, deletedBy } = input;

    const entry = await this.findOneById(context, id);
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.project.update({
      where: {
        id,
        deletedAt: null,
      },
      data: {
        deletedBy: deletedBy as Prisma.InputJsonValue,
        deletedAt: new Date(),
      },
    });
    const dto = plainToInstance(ProjectDto, updatedEntry, {
      excludeExtraneousValues: true,
      exposeDefaultValues: true,
    });

    await this.cacheService.del(ProjectService.generateCacheId(id));

    this.eventsService.emitEvent({
      entity: ProjectEntities.PROJECT,
      entityId: ProjectService.generateEntityId(updatedEntry),
      eventName: ProjectEvents.PROJECT_DELETED,
      event: new ProjectDeletedEvent(),
      action: EventAction.DELETE,
      before: entry,
      after: dto,
    });

    return dto;
  }
}
