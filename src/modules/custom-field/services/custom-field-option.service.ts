import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma, CustomFieldOption } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

import { EventsService, CacheService, PrismaService } from '@modules/core';
import {
  CreateCustomFieldOptionDto,
  UpdateCustomFieldOptionDto,
  DeleteCustomFieldOptionDto,
  CustomFieldOptionCreatedEvent,
  CustomFieldOptionUpdatedEvent,
  CustomFieldOptionDeletedEvent,
  CustomFieldEvents,
  CustomFieldOptionDto,
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
export class CustomFieldOptionService {
  private readonly logger = new Logger(CustomFieldOptionService.name);

  static generateCacheId({ projectId, id }: GenerateCacheIdParams) {
    return `Project-${projectId}/CustomFieldOption-${id}/ID`;
  }

  static generateEntityId(entry: CustomFieldOption) {
    return `Project-${entry.projectId}/CustomFieldOption-${entry.id}`;
  }

  constructor(
    private readonly cacheService: CacheService<CustomFieldOptionDto>,
    private readonly prisma: PrismaService,
    private readonly eventsService: EventsService<CustomFieldOptionDto>,
  ) {}

  async findOneById(
    context: Context,
    { projectId, id }: FindOneByIdParams,
  ): Promise<CustomFieldOptionDto | null> {
    const cachedData = await this.cacheService.get(
      CustomFieldOptionService.generateCacheId({
        projectId,
        id,
      }),
    );

    if (cachedData) {
      return plainToInstance(
        CustomFieldOptionDto,
        cachedData,
        DEFAULT_CLASS_TRANFORM_OPTIONS,
      );
    }

    const entry = await this.prisma.customFieldOption.findUnique({
      where: {
        id,
        projectId,
        deletedAt: null,
      },
    });
    const dto = plainToInstance(
      CustomFieldOptionDto,
      entry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    if (!!dto) {
      await this.cacheService.set(
        CustomFieldOptionService.generateCacheId(dto),
        dto,
      );
    }

    return dto;
  }

  async findAll(
    context: Context,
    pageOptionsDto: PageOptionsDto,
    filters: Prisma.CustomFieldOptionWhereInput = {},
  ): Promise<PageDto<CustomFieldOptionDto>> {
    const [entries, total] = await Promise.all([
      this.prisma.customFieldOption.findMany({
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
      this.prisma.customFieldOption.count({
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
          CustomFieldOptionDto,
          entry,
          DEFAULT_CLASS_TRANFORM_OPTIONS,
        ),
      ),
      pageMetaDto,
    );
  }

  async create(
    context: Context,
    { projectId, ...input }: CreateCustomFieldOptionDto,
  ): Promise<CustomFieldOptionDto> {
    const entry = await this.prisma.customFieldOption.create({
      data: {
        ...input,
        projectId,
        createdBy: input.createdBy as Prisma.InputJsonValue,
        updatedBy: input.createdBy as Prisma.InputJsonValue,
      },
    });
    const dto = plainToInstance(
      CustomFieldOptionDto,
      entry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.set(
      CustomFieldOptionService.generateCacheId(entry),
      dto,
    );

    this.eventsService.emitEvent({
      projectId,
      entity: CustomFieldEntities.CUSTOM_FIELD_OPTION,
      entityId: CustomFieldOptionService.generateEntityId(entry),
      eventName: CustomFieldEvents.CUSTOM_FIELD_OPTION_CREATED,
      event: new CustomFieldOptionCreatedEvent(),
      action: EventAction.CREATE,
      after: dto,
    });

    return dto;
  }

  async update(
    context: Context,
    { id, projectId, updatedBy, ...data }: UpdateCustomFieldOptionDto,
  ): Promise<CustomFieldOptionDto> {
    const entry = await this.findOneById(context, {
      projectId,
      id,
    });
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.customFieldOption.update({
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
      CustomFieldOptionDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.set(
      CustomFieldOptionService.generateCacheId(dto),
      dto,
    );

    this.eventsService.emitEvent({
      projectId,
      entity: CustomFieldEntities.CUSTOM_FIELD_OPTION,
      entityId: CustomFieldOptionService.generateEntityId(updatedEntry),
      eventName: CustomFieldEvents.CUSTOM_FIELD_OPTION_UPDATED,
      event: new CustomFieldOptionUpdatedEvent(),
      action: EventAction.UPDATE,
      before: entry,
      after: dto,
    });

    return dto;
  }

  async delete(
    context: Context,
    input: DeleteCustomFieldOptionDto,
  ): Promise<CustomFieldOptionDto> {
    const { id, projectId, deletedBy } = input;

    const entry = await this.findOneById(context, {
      projectId,
      id,
    });
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.customFieldOption.update({
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
      CustomFieldOptionDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.del(CustomFieldOptionService.generateCacheId(dto));

    this.eventsService.emitEvent({
      projectId,
      entity: CustomFieldEntities.CUSTOM_FIELD_OPTION,
      entityId: CustomFieldOptionService.generateEntityId(updatedEntry),
      eventName: CustomFieldEvents.CUSTOM_FIELD_OPTION_DELETED,
      event: new CustomFieldOptionDeletedEvent(),
      action: EventAction.DELETE,
      before: entry,
      after: dto,
    });

    return dto;
  }
}
