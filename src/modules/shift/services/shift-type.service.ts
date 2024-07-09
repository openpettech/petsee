import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma, ShiftType } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

import { EventsService, CacheService, PrismaService } from '@modules/core';
import {
  CreateShiftTypeDto,
  UpdateShiftTypeDto,
  DeleteShiftTypeDto,
  ShiftTypeCreatedEvent,
  ShiftTypeUpdatedEvent,
  ShiftTypeDeletedEvent,
  ShiftEvents,
  ShiftTypeDto,
  ShiftEntities,
} from '@contracts/shift';
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
export class ShiftTypeService {
  private readonly logger = new Logger(ShiftTypeService.name);

  static generateCacheId({ projectId, id }: GenerateCacheIdParams) {
    return `Project-${projectId}/ShiftType-${id}/ID`;
  }

  static generateEntityId(entry: ShiftType) {
    return `Project-${entry.projectId}/ShiftType-${entry.id}`;
  }

  constructor(
    private readonly cacheService: CacheService<ShiftTypeDto>,
    private readonly prisma: PrismaService,
    private readonly eventsService: EventsService<ShiftTypeDto>,
  ) {}

  async findOneById(
    context: Context,
    { projectId, id }: FindOneByIdParams,
  ): Promise<ShiftTypeDto | null> {
    const cachedData = await this.cacheService.get(
      ShiftTypeService.generateCacheId({ projectId, id }),
    );
    if (cachedData) {
      return plainToInstance(
        ShiftTypeDto,
        cachedData,
        DEFAULT_CLASS_TRANFORM_OPTIONS,
      );
    }

    const entry = await this.prisma.shiftType.findUnique({
      where: {
        id,
        projectId,
        deletedAt: null,
      },
    });
    const dto = plainToInstance(
      ShiftTypeDto,
      entry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    if (!!dto) {
      await this.cacheService.set(ShiftTypeService.generateCacheId(dto), dto);
    }

    return dto;
  }

  async findAll(
    context: Context,
    pageOptionsDto: PageOptionsDto,
    filters: Prisma.ShiftTypeWhereInput = {},
  ): Promise<PageDto<ShiftTypeDto>> {
    const [entries, total] = await Promise.all([
      this.prisma.shiftType.findMany({
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
      this.prisma.shiftType.count({
        where: {
          ...filters,
          deletedAt: null,
        },
      }),
    ]);

    const pageMetaDto = new PageMetaDto({ total, pageOptionsDto });

    return new PageDto(
      entries.map((entry) =>
        plainToInstance(ShiftTypeDto, entry, DEFAULT_CLASS_TRANFORM_OPTIONS),
      ),
      pageMetaDto,
    );
  }

  async create(
    context: Context,
    { projectId, ...input }: CreateShiftTypeDto,
  ): Promise<ShiftTypeDto> {
    const entry = await this.prisma.shiftType.create({
      data: {
        ...input,
        projectId,
        createdBy: input.createdBy as Prisma.InputJsonValue,
        updatedBy: input.createdBy as Prisma.InputJsonValue,
      },
    });
    const dto = plainToInstance(
      ShiftTypeDto,
      entry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.set(ShiftTypeService.generateCacheId(entry), dto);

    this.eventsService.emitEvent({
      projectId,
      entity: ShiftEntities.SHIFT_TYPE,
      entityId: ShiftTypeService.generateEntityId(entry),
      eventName: ShiftEvents.SHIFT_TYPE_CREATED,
      event: new ShiftTypeCreatedEvent(),
      action: EventAction.CREATE,
      after: dto,
    });

    return dto;
  }

  async update(
    context: Context,
    { id, projectId, updatedBy, ...data }: UpdateShiftTypeDto,
  ): Promise<ShiftTypeDto> {
    const entry = await this.findOneById(context, { projectId, id });
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.shiftType.update({
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
      ShiftTypeDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.set(ShiftTypeService.generateCacheId(dto), dto);

    this.eventsService.emitEvent({
      projectId,
      entity: ShiftEntities.SHIFT_TYPE,
      entityId: ShiftTypeService.generateEntityId(updatedEntry),
      eventName: ShiftEvents.SHIFT_TYPE_UPDATED,
      event: new ShiftTypeUpdatedEvent(),
      action: EventAction.UPDATE,
      before: entry,
      after: dto,
    });

    return dto;
  }

  async delete(
    context: Context,
    input: DeleteShiftTypeDto,
  ): Promise<ShiftTypeDto> {
    const { id, projectId, deletedBy } = input;

    const entry = await this.findOneById(context, { projectId, id });
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.shiftType.update({
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
      ShiftTypeDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.del(ShiftTypeService.generateCacheId(dto));

    this.eventsService.emitEvent({
      projectId,
      entity: ShiftEntities.SHIFT_TYPE,
      entityId: ShiftTypeService.generateEntityId(updatedEntry),
      eventName: ShiftEvents.SHIFT_TYPE_DELETED,
      event: new ShiftTypeDeletedEvent(),
      action: EventAction.DELETE,
      before: entry,
      after: dto,
    });

    return dto;
  }
}
