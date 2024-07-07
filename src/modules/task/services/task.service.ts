import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma, Task } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

import { EventsService, CacheService, PrismaService } from '@modules/core';
import {
  CreateTaskDto,
  UpdateTaskDto,
  DeleteTaskDto,
  TaskCreatedEvent,
  TaskUpdatedEvent,
  TaskDeletedEvent,
  TaskEvents,
  TaskDto,
  TaskEntities,
} from '@contracts/task';
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
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  static generateCacheId({ projectId, id }: GenerateCacheIdParams) {
    return `Project-${projectId}/Task-${id}/ID`;
  }

  static generateEntityId(entry: Task) {
    return `Project-${entry.projectId}/Task-${entry.id}`;
  }

  constructor(
    private readonly cacheService: CacheService<TaskDto>,
    private readonly prisma: PrismaService,
    private readonly eventsService: EventsService<TaskDto>,
  ) {}

  async findOneById(
    context: Context,
    { projectId, id }: FindOneByIdParams,
  ): Promise<TaskDto | null> {
    const cachedData = await this.cacheService.get(
      TaskService.generateCacheId({ projectId, id }),
    );
    if (cachedData) {
      return plainToInstance(
        TaskDto,
        cachedData,
        DEFAULT_CLASS_TRANFORM_OPTIONS,
      );
    }

    const entry = await this.prisma.task.findUnique({
      where: {
        id,
        projectId,
        deletedAt: null,
      },
    });
    const dto = plainToInstance(TaskDto, entry, DEFAULT_CLASS_TRANFORM_OPTIONS);

    if (!!dto) {
      await this.cacheService.set(TaskService.generateCacheId(dto), dto);
    }

    return dto;
  }

  async findAll(
    context: Context,
    pageOptionsDto: PageOptionsDto,
    filters: Prisma.TaskWhereInput = {},
  ): Promise<PageDto<TaskDto>> {
    const [entries, total] = await Promise.all([
      this.prisma.task.findMany({
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
      this.prisma.task.count({
        where: {
          ...filters,
          deletedAt: null,
        },
      }),
    ]);

    const pageMetaDto = new PageMetaDto({ total, pageOptionsDto });

    return new PageDto(
      entries.map((entry) =>
        plainToInstance(TaskDto, entry, DEFAULT_CLASS_TRANFORM_OPTIONS),
      ),
      pageMetaDto,
    );
  }

  async create(
    context: Context,
    { projectId, ...input }: CreateTaskDto,
  ): Promise<TaskDto> {
    const entry = await this.prisma.task.create({
      data: {
        ...input,
        projectId,
        createdBy: input.createdBy as Prisma.InputJsonValue,
        updatedBy: input.createdBy as Prisma.InputJsonValue,
      },
    });
    const dto = plainToInstance(TaskDto, entry, DEFAULT_CLASS_TRANFORM_OPTIONS);

    await this.cacheService.set(TaskService.generateCacheId(entry), dto);

    this.eventsService.emitEvent({
      projectId,
      entity: TaskEntities.TASK,
      entityId: TaskService.generateEntityId(entry),
      eventName: TaskEvents.TASK_CREATED,
      event: new TaskCreatedEvent(),
      action: EventAction.CREATE,
      after: dto,
    });

    return dto;
  }

  async update(
    context: Context,
    { id, projectId, updatedBy, ...data }: UpdateTaskDto,
  ): Promise<TaskDto> {
    const entry = await this.findOneById(context, { projectId, id });
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.task.update({
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
      TaskDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.set(TaskService.generateCacheId(dto), dto);

    this.eventsService.emitEvent({
      projectId,
      entity: TaskEntities.TASK,
      entityId: TaskService.generateEntityId(updatedEntry),
      eventName: TaskEvents.TASK_UPDATED,
      event: new TaskUpdatedEvent(),
      action: EventAction.UPDATE,
      before: entry,
      after: dto,
    });

    return dto;
  }

  async delete(context: Context, input: DeleteTaskDto): Promise<TaskDto> {
    const { id, projectId, deletedBy } = input;

    const entry = await this.findOneById(context, { projectId, id });
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.task.update({
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
      TaskDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.del(TaskService.generateCacheId(dto));

    this.eventsService.emitEvent({
      projectId,
      entity: TaskEntities.TASK,
      entityId: TaskService.generateEntityId(updatedEntry),
      eventName: TaskEvents.TASK_DELETED,
      event: new TaskDeletedEvent(),
      action: EventAction.DELETE,
      before: entry,
      after: dto,
    });

    return dto;
  }
}
