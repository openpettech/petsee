import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma, CustomField } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

import { EventsService, CacheService, PrismaService } from '@modules/core';
import {
  CreateCustomFieldDto,
  UpdateCustomFieldDto,
  DeleteCustomFieldDto,
  CustomFieldCreatedEvent,
  CustomFieldUpdatedEvent,
  CustomFieldDeletedEvent,
  CustomFieldEvents,
  CustomFieldDto,
  CustomFieldEntities,
} from '@contracts/custom-field';
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
export class CustomFieldService {
  private readonly logger = new Logger(CustomFieldService.name);

  static generateCacheId({ projectId, id }: GenerateCacheIdParams) {
    return `Project-${projectId}/CustomField-${id}/ID`;
  }

  static generateEntityId(entry: CustomField) {
    return `Project-${entry.projectId}/CustomField-${entry.id}`;
  }

  constructor(
    private readonly cacheService: CacheService<CustomFieldDto>,
    private readonly prisma: PrismaService,
    private readonly eventsService: EventsService<CustomFieldDto>,
  ) {}

  async findOneById(
    context: Context,
    { projectId, id }: FindOneByIdParams,
  ): Promise<CustomFieldDto | null> {
    const cachedData = await this.cacheService.get(
      CustomFieldService.generateCacheId({ projectId, id }),
    );
    if (cachedData) {
      return plainToInstance(
        CustomFieldDto,
        cachedData,
        DEFAULT_CLASS_TRANFORM_OPTIONS,
      );
    }

    const entry = await this.prisma.customField.findUnique({
      where: {
        id,
        projectId,
        deletedAt: null,
      },
    });
    const dto = plainToInstance(
      CustomFieldDto,
      entry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    if (!!dto) {
      await this.cacheService.set(CustomFieldService.generateCacheId(dto), dto);
    }

    return dto;
  }

  async findAll(
    context: Context,
    pageOptionsDto: PageOptionsDto,
    filters: Prisma.CustomFieldWhereInput = {},
  ): Promise<PageDto<CustomFieldDto>> {
    const [entries, total] = await Promise.all([
      this.prisma.customField.findMany({
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
      this.prisma.customField.count({
        where: {
          ...filters,
          deletedAt: null,
        },
      }),
    ]);

    const pageMetaDto = new PageMetaDto({ total, pageOptionsDto });

    return new PageDto(
      entries.map((entry) =>
        plainToInstance(CustomFieldDto, entry, DEFAULT_CLASS_TRANFORM_OPTIONS),
      ),
      pageMetaDto,
    );
  }

  async create(
    context: Context,
    { projectId, ...input }: CreateCustomFieldDto,
  ): Promise<CustomFieldDto> {
    const entry = await this.prisma.customField.create({
      data: {
        ...input,
        projectId,
        createdBy: input.createdBy as Prisma.InputJsonValue,
        updatedBy: input.createdBy as Prisma.InputJsonValue,
      },
    });
    const dto = plainToInstance(CustomFieldDto, entry, {
      excludeExtraneousValues: true,
      exposeDefaultValues: true,
    });

    await this.cacheService.set(CustomFieldService.generateCacheId(dto), dto);

    this.eventsService.emitEvent({
      projectId,
      entity: CustomFieldEntities.CUSTOM_FIELD,
      entityId: CustomFieldService.generateEntityId(entry),
      eventName: CustomFieldEvents.CUSTOM_FIELD_CREATED,
      event: new CustomFieldCreatedEvent(),
      action: EventAction.CREATE,
      after: dto,
    });

    return dto;
  }

  async update(
    context: Context,
    { id, projectId, updatedBy, ...data }: UpdateCustomFieldDto,
  ): Promise<CustomFieldDto> {
    const entry = await this.findOneById(context, { projectId, id });
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.customField.update({
      where: {
        id,
        deletedAt: null,
      },
      data: {
        updatedBy: updatedBy as Prisma.InputJsonValue,
        ...data,
      },
    });
    const dto = plainToInstance(
      CustomFieldDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.set(CustomFieldService.generateCacheId(dto), dto);

    this.eventsService.emitEvent({
      projectId,
      entity: CustomFieldEntities.CUSTOM_FIELD,
      entityId: CustomFieldService.generateEntityId(updatedEntry),
      eventName: CustomFieldEvents.CUSTOM_FIELD_UPDATED,
      event: new CustomFieldUpdatedEvent(),
      action: EventAction.UPDATE,
      before: entry,
      after: dto,
    });

    return dto;
  }

  async delete(
    context: Context,
    input: DeleteCustomFieldDto,
  ): Promise<CustomFieldDto> {
    const { id, projectId, deletedBy } = input;

    const entry = await this.findOneById(context, { projectId, id });
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.customField.update({
      where: {
        id,
        deletedAt: null,
      },
      data: {
        deletedBy: deletedBy as Prisma.InputJsonValue,
        deletedAt: new Date(),
      },
    });
    const dto = plainToInstance(
      CustomFieldDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.del(CustomFieldService.generateCacheId(dto));

    this.eventsService.emitEvent({
      projectId,
      entity: CustomFieldEntities.CUSTOM_FIELD,
      entityId: CustomFieldService.generateEntityId(updatedEntry),
      eventName: CustomFieldEvents.CUSTOM_FIELD_DELETED,
      event: new CustomFieldDeletedEvent(),
      action: EventAction.DELETE,
      before: entry,
      after: dto,
    });

    return dto;
  }
}
