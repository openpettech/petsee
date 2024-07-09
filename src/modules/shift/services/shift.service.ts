import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma, Shift } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { v4 } from 'uuid';

import { EventsService, CacheService, PrismaService } from '@modules/core';
import {
  CreateShiftDto,
  UpdateShiftDto,
  DeleteShiftDto,
  ShiftCreatedEvent,
  ShiftUpdatedEvent,
  ShiftDeletedEvent,
  ShiftEvents,
  ShiftDto,
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
import { createConnectObject } from '@utils/prisma';

type GenerateCacheIdParams = {
  projectId: string;
  id: string;
};

type FindOneByIdParams = {
  projectId: string;
  id: string;
};

@Injectable()
export class ShiftService {
  private readonly logger = new Logger(ShiftService.name);

  static generateCacheId({ projectId, id }: GenerateCacheIdParams) {
    return `Project-${projectId}/Shift-${id}/ID`;
  }

  static generateEntityId(entry: Shift) {
    return `Project-${entry.projectId}/Shift-${entry.id}`;
  }

  constructor(
    private readonly cacheService: CacheService<ShiftDto>,
    private readonly prisma: PrismaService,
    private readonly eventsService: EventsService<ShiftDto>,
  ) {}

  async findOneById(
    context: Context,
    { projectId, id }: FindOneByIdParams,
  ): Promise<ShiftDto | null> {
    const cachedData = await this.cacheService.get(
      ShiftService.generateCacheId({ projectId, id }),
    );
    if (cachedData) {
      return plainToInstance(
        ShiftDto,
        cachedData,
        DEFAULT_CLASS_TRANFORM_OPTIONS,
      );
    }

    const entry = await this.prisma.shift.findUnique({
      where: {
        id,
        projectId,
        deletedAt: null,
      },
    });
    const dto = plainToInstance(
      ShiftDto,
      entry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    if (!!dto) {
      await this.cacheService.set(ShiftService.generateCacheId(dto), dto);
    }

    return dto;
  }

  async findAll(
    context: Context,
    pageOptionsDto: PageOptionsDto,
    filters: Prisma.ShiftWhereInput = {},
  ): Promise<PageDto<ShiftDto>> {
    const [entries, total] = await Promise.all([
      this.prisma.shift.findMany({
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
      this.prisma.shift.count({
        where: {
          ...filters,
          deletedAt: null,
        },
      }),
    ]);

    const pageMetaDto = new PageMetaDto({ total, pageOptionsDto });

    return new PageDto(
      entries.map((entry) =>
        plainToInstance(ShiftDto, entry, DEFAULT_CLASS_TRANFORM_OPTIONS),
      ),
      pageMetaDto,
    );
  }

  async create(
    context: Context,
    { projectId, shiftTypeId, ...input }: CreateShiftDto,
  ): Promise<ShiftDto> {
    const id = v4();
    const entry = await this.prisma.shift.create({
      data: {
        ...input,
        id,
        groupId: id,
        project: createConnectObject(projectId),
        shiftType: createConnectObject(shiftTypeId),
        createdBy: input.createdBy as Prisma.InputJsonValue,
        updatedBy: input.createdBy as Prisma.InputJsonValue,
      },
    });
    const dto = plainToInstance(
      ShiftDto,
      entry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.set(ShiftService.generateCacheId(entry), dto);

    this.eventsService.emitEvent({
      projectId,
      entity: ShiftEntities.SHIFT_TYPE,
      entityId: ShiftService.generateEntityId(entry),
      eventName: ShiftEvents.SHIFT_TYPE_CREATED,
      event: new ShiftCreatedEvent(),
      action: EventAction.CREATE,
      after: dto,
    });

    return dto;
  }

  async update(
    context: Context,
    { id, projectId, updatedBy, ...data }: UpdateShiftDto,
  ): Promise<ShiftDto> {
    const entry = await this.findOneById(context, { projectId, id });
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.shift.update({
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
      ShiftDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.set(ShiftService.generateCacheId(dto), dto);

    this.eventsService.emitEvent({
      projectId,
      entity: ShiftEntities.SHIFT_TYPE,
      entityId: ShiftService.generateEntityId(updatedEntry),
      eventName: ShiftEvents.SHIFT_TYPE_UPDATED,
      event: new ShiftUpdatedEvent(),
      action: EventAction.UPDATE,
      before: entry,
      after: dto,
    });

    return dto;
  }

  async delete(context: Context, input: DeleteShiftDto): Promise<ShiftDto> {
    const { id, projectId, deletedBy } = input;

    const entry = await this.findOneById(context, { projectId, id });
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.shift.update({
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
      ShiftDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.del(ShiftService.generateCacheId(dto));

    this.eventsService.emitEvent({
      projectId,
      entity: ShiftEntities.SHIFT_TYPE,
      entityId: ShiftService.generateEntityId(updatedEntry),
      eventName: ShiftEvents.SHIFT_TYPE_DELETED,
      event: new ShiftDeletedEvent(),
      action: EventAction.DELETE,
      before: entry,
      after: dto,
    });

    return dto;
  }
}
