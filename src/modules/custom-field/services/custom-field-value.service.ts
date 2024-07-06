import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, CustomFieldValue, CustomFieldType } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

import { EventsService, CacheService, PrismaService } from '@modules/core';
import {
  CreateCustomFieldValueDto,
  UpdateCustomFieldValueDto,
  DeleteCustomFieldValueDto,
  CustomFieldValueCreatedEvent,
  CustomFieldValueUpdatedEvent,
  CustomFieldValueDeletedEvent,
  CustomFieldEvents,
  CustomFieldValueDto,
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

import { CustomFieldService } from './custom-field.service';
import { CustomFieldOptionService } from './custom-field-option.service';

type GenerateCacheIdParams = {
  projectId: string;
  id: string;
};

type FindOneByIdParams = {
  projectId: string;
  id: string;
};

@Injectable()
export class CustomFieldValueService {
  private readonly logger = new Logger(CustomFieldValueService.name);

  static generateCacheId({ projectId, id }: GenerateCacheIdParams) {
    return `Project-${projectId}/CustomFieldValue-${id}/ID`;
  }

  static generateEntityId(entry: CustomFieldValue) {
    return `Project-${entry.projectId}/CustomFieldValue-${entry.id}`;
  }

  constructor(
    private readonly cacheService: CacheService<CustomFieldValueDto>,
    private readonly prisma: PrismaService,
    private readonly eventsService: EventsService<CustomFieldValueDto>,
    private readonly customFieldService: CustomFieldService,
    private readonly customFieldOptionService: CustomFieldOptionService,
  ) {}

  async findOneById(
    context: Context,
    { projectId, id }: FindOneByIdParams,
  ): Promise<CustomFieldValueDto | null> {
    const cachedData = await this.cacheService.get(
      CustomFieldValueService.generateCacheId({
        projectId,
        id,
      }),
    );

    if (cachedData) {
      return plainToInstance(
        CustomFieldValueDto,
        cachedData,
        DEFAULT_CLASS_TRANFORM_OPTIONS,
      );
    }

    const entry = await this.prisma.customFieldValue.findUnique({
      where: {
        id,
        projectId,
        deletedAt: null,
      },
    });
    const dto = plainToInstance(
      CustomFieldValueDto,
      entry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    if (!!dto) {
      await this.cacheService.set(
        CustomFieldValueService.generateCacheId(dto),
        dto,
      );
    }

    return dto;
  }

  async findAll(
    context: Context,
    pageOptionsDto: PageOptionsDto,
    filters: Prisma.CustomFieldValueWhereInput = {},
  ): Promise<PageDto<CustomFieldValueDto>> {
    const [entries, total] = await Promise.all([
      this.prisma.customFieldValue.findMany({
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
      this.prisma.customFieldValue.count({
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
          CustomFieldValueDto,
          entry,
          DEFAULT_CLASS_TRANFORM_OPTIONS,
        ),
      ),
      pageMetaDto,
    );
  }

  async create(
    context: Context,
    { projectId, ...input }: CreateCustomFieldValueDto,
  ): Promise<CustomFieldValueDto> {
    const customField = await this.customFieldService.findOneById(context, {
      projectId,
      id: input.customFieldId,
    });

    if (!customField) {
      throw new NotFoundException('Custom Field not found');
    }

    const options: CustomFieldType[] = [
      CustomFieldType.MULTI_CHECKBOX,
      CustomFieldType.MULTI_SELECT,
      CustomFieldType.RADIO,
      CustomFieldType.SINGLE_SELECT,
    ];

    if (options.includes(customField.type)) {
      const { items } = await this.customFieldOptionService.findAll(
        context,
        {
          offset: 0,
          limit: 1000,
        },
        {
          customFieldId: input.customFieldId,
        },
      );

      const existingValue = items.find((entry) => {
        entry.value === input.value;
      });

      if (!existingValue) {
        throw new BadRequestException('Invalid value');
      }
    }

    const entry = await this.prisma.customFieldValue.create({
      data: {
        ...input,
        projectId,
        createdBy: input.createdBy as Prisma.InputJsonValue,
        updatedBy: input.createdBy as Prisma.InputJsonValue,
      },
    });
    const dto = plainToInstance(
      CustomFieldValueDto,
      entry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.set(
      CustomFieldValueService.generateCacheId(entry),
      dto,
    );

    this.eventsService.emitEvent({
      projectId,
      entity: CustomFieldEntities.CUSTOM_FIELD_VALUE,
      entityId: CustomFieldValueService.generateEntityId(entry),
      eventName: CustomFieldEvents.CUSTOM_FIELD_VALUE_CREATED,
      event: new CustomFieldValueCreatedEvent(),
      action: EventAction.CREATE,
      after: dto,
    });

    return dto;
  }

  async update(
    context: Context,
    { id, projectId, updatedBy, ...input }: UpdateCustomFieldValueDto,
  ): Promise<CustomFieldValueDto> {
    const entry = await this.findOneById(context, {
      projectId,
      id,
    });
    if (!entry) {
      throw new NotFoundException(id);
    }

    const customField = await this.customFieldService.findOneById(context, {
      projectId,
      id: entry.customFieldId,
    });

    if (!customField) {
      throw new NotFoundException('Custom Field not found');
    }

    const options: CustomFieldType[] = [
      CustomFieldType.MULTI_CHECKBOX,
      CustomFieldType.MULTI_SELECT,
      CustomFieldType.RADIO,
      CustomFieldType.SINGLE_SELECT,
    ];

    if (entry.value !== input.value && options.includes(customField.type)) {
      const { items } = await this.customFieldOptionService.findAll(
        context,
        {
          offset: 0,
          limit: 1000,
        },
        {
          customFieldId: entry.customFieldId,
        },
      );

      const existingValue = items.find((entry) => {
        entry.value === input.value;
      });

      if (!existingValue) {
        throw new BadRequestException('Invalid value');
      }
    }

    const updatedEntry = await this.prisma.customFieldValue.update({
      where: {
        id,
        projectId,
        deletedAt: null,
      },
      data: {
        updatedBy: updatedBy as Prisma.InputJsonValue,
        ...input,
      },
    });
    const dto = plainToInstance(
      CustomFieldValueDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.set(
      CustomFieldValueService.generateCacheId(dto),
      dto,
    );

    this.eventsService.emitEvent({
      projectId,
      entity: CustomFieldEntities.CUSTOM_FIELD_VALUE,
      entityId: CustomFieldValueService.generateEntityId(updatedEntry),
      eventName: CustomFieldEvents.CUSTOM_FIELD_VALUE_UPDATED,
      event: new CustomFieldValueUpdatedEvent(),
      action: EventAction.UPDATE,
      before: entry,
      after: dto,
    });

    return dto;
  }

  async delete(
    context: Context,
    input: DeleteCustomFieldValueDto,
  ): Promise<CustomFieldValueDto> {
    const { id, projectId, deletedBy } = input;

    const entry = await this.findOneById(context, input);
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.customFieldValue.update({
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
      CustomFieldValueDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.del(CustomFieldValueService.generateCacheId(dto));

    this.eventsService.emitEvent({
      projectId,
      entity: CustomFieldEntities.CUSTOM_FIELD_VALUE,
      entityId: CustomFieldValueService.generateEntityId(updatedEntry),
      eventName: CustomFieldEvents.CUSTOM_FIELD_VALUE_DELETED,
      event: new CustomFieldValueDeletedEvent(),
      action: EventAction.DELETE,
      before: entry,
      after: dto,
    });

    return dto;
  }
}
