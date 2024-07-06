import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma, Customer, TagType } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

import {
  CreateCustomerDto,
  UpdateCustomerDto,
  DeleteCustomerDto,
  CustomerCreatedEvent,
  CustomerUpdatedEvent,
  CustomerDeletedEvent,
  CustomerEvents,
  CustomerDto,
  CustomerEntities,
} from '@contracts/customer';
import {
  PageDto,
  PageMetaDto,
  PageOptionsDto,
  Context,
} from '@contracts/common';
import { EventAction } from '@contracts/events';
import { DEFAULT_CLASS_TRANFORM_OPTIONS } from '@constants/class-transformer.constant';
import { EventsService, CacheService, PrismaService } from '@modules/core';
import { TagService } from '@modules/tag';

interface GenerateCacheIdParams {
  projectId: string;
  id: string;
}

interface FindOneByIdParams {
  projectId: string;
  id: string;
}

@Injectable()
export class CustomerService {
  private readonly logger = new Logger(CustomerService.name);

  static generateCacheId({ projectId, id }: GenerateCacheIdParams) {
    return `Project-${projectId}/Customer-${id}/ID`;
  }

  static generateEntityId(entry: Customer) {
    return `Project-${entry.projectId}/Customer-${entry.id}`;
  }

  constructor(
    private readonly cacheService: CacheService<CustomerDto>,
    private readonly prisma: PrismaService,
    private readonly eventsService: EventsService<CustomerDto>,
    private readonly tagService: TagService,
  ) {}

  async findOneById(
    context: Context,
    { projectId, id }: FindOneByIdParams,
  ): Promise<CustomerDto | null> {
    const cachedData = await this.cacheService.get(
      CustomerService.generateCacheId({ projectId, id }),
    );
    if (cachedData) {
      return plainToInstance(
        CustomerDto,
        cachedData,
        DEFAULT_CLASS_TRANFORM_OPTIONS,
      );
    }

    const entry = await this.prisma.customer.findUnique({
      where: {
        id,
        projectId,
        deletedAt: null,
      },
    });
    const dto = plainToInstance(
      CustomerDto,
      entry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    if (!!dto) {
      await this.cacheService.set(
        CustomerService.generateCacheId({ projectId, id }),
        dto,
      );
    }

    return dto;
  }

  async findAll(
    context: Context,
    pageOptionsDto: PageOptionsDto,
    filters: Prisma.CustomerWhereInput = {},
  ): Promise<PageDto<CustomerDto>> {
    const [entries, total] = await Promise.all([
      this.prisma.customer.findMany({
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
      this.prisma.customer.count({
        where: {
          ...filters,
          deletedAt: null,
        },
      }),
    ]);

    const pageMetaDto = new PageMetaDto({ total, pageOptionsDto });

    return new PageDto(
      entries.map((entry) =>
        plainToInstance(CustomerDto, entry, DEFAULT_CLASS_TRANFORM_OPTIONS),
      ),
      pageMetaDto,
    );
  }

  async create(
    context: Context,
    { projectId, tagIds, ...input }: Omit<CreateCustomerDto, 'name' | 'locale'>,
  ): Promise<CustomerDto> {
    if (!!tagIds?.length) {
      await this.tagService.validateTags(context, {
        projectId,
        tagIds,
        type: TagType.CUSTOMER,
      });
    }

    const entry = await this.prisma.customer.create({
      data: {
        ...input,
        projectId,
        ...(!!tagIds?.length
          ? {
              tags: {
                connect: tagIds.map((id) => ({
                  id,
                  projectId,
                })),
              },
            }
          : {}),
        createdBy: input.createdBy as Prisma.InputJsonValue,
        updatedBy: input.createdBy as Prisma.InputJsonValue,
      },
    });
    const dto = plainToInstance(
      CustomerDto,
      entry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.set(CustomerService.generateCacheId(entry), dto);

    this.eventsService.emitEvent({
      projectId,
      entity: CustomerEntities.CUSTOMER,
      entityId: CustomerService.generateEntityId(entry),
      eventName: CustomerEvents.CUSTOMER_CREATED,
      event: new CustomerCreatedEvent(),
      action: EventAction.CREATE,
      after: dto,
    });

    return dto;
  }

  async update(
    context: Context,
    { id, projectId, tagIds, updatedBy, ...data }: UpdateCustomerDto,
  ): Promise<CustomerDto> {
    const entry = await this.findOneById(context, { projectId, id });
    if (!entry) {
      throw new NotFoundException(id);
    }

    if (!!tagIds?.length) {
      await this.tagService.validateTags(context, {
        projectId,
        tagIds,
        type: TagType.CUSTOMER,
      });
    }

    const updatedEntry = await this.prisma.customer.update({
      where: {
        id,
        projectId,
        deletedAt: null,
      },
      data: {
        updatedBy: updatedBy as Prisma.InputJsonValue,
        ...(!!tagIds?.length
          ? {
              tags: {
                connect: tagIds.map((id) => ({
                  id,
                  projectId,
                })),
              },
            }
          : {}),
        ...data,
      },
    });
    const dto = plainToInstance(
      CustomerDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.set(CustomerService.generateCacheId(dto), dto);

    this.eventsService.emitEvent({
      projectId,
      entity: CustomerEntities.CUSTOMER,
      entityId: CustomerService.generateEntityId(updatedEntry),
      eventName: CustomerEvents.CUSTOMER_UPDATED,
      event: new CustomerUpdatedEvent(),
      action: EventAction.UPDATE,
      before: entry,
      after: dto,
    });

    return dto;
  }

  async delete(
    context: Context,
    input: DeleteCustomerDto,
  ): Promise<CustomerDto> {
    const { id, projectId, deletedBy } = input;

    const entry = await this.findOneById(context, { projectId, id });
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.customer.update({
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
    const dto = plainToInstance(CustomerDto, updatedEntry, {
      excludeExtraneousValues: true,
      exposeDefaultValues: true,
    });

    await this.cacheService.del(CustomerService.generateCacheId(dto));

    this.eventsService.emitEvent({
      projectId,
      entity: CustomerEntities.CUSTOMER,
      entityId: CustomerService.generateEntityId(updatedEntry),
      eventName: CustomerEvents.CUSTOMER_DELETED,
      event: new CustomerDeletedEvent(),
      action: EventAction.DELETE,
      before: entry,
      after: dto,
    });

    return dto;
  }
}
