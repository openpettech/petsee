import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma, Contact } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

import { EventsService, CacheService, PrismaService } from '@modules/core';
import {
  CreateContactDto,
  UpdateContactDto,
  DeleteContactDto,
  ContactCreatedEvent,
  ContactUpdatedEvent,
  ContactDeletedEvent,
  CustomerEvents,
  ContactDto,
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

interface GenerateCacheIdParams {
  projectId: string;
  id: string;
}

interface FindOneByIdParams {
  projectId: string;
  id: string;
}

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  static generateCacheId({ projectId, id }: GenerateCacheIdParams) {
    return `Project-${projectId}/Contact-${id}/ID`;
  }

  static generateEntityId(entry: Contact) {
    return `Project-${entry.projectId}/Contact-${entry.id}`;
  }

  constructor(
    private readonly cacheService: CacheService<ContactDto>,
    private readonly prisma: PrismaService,
    private readonly eventsService: EventsService<ContactDto>,
  ) {}

  async findOneById(
    context: Context,
    { projectId, id }: FindOneByIdParams,
  ): Promise<ContactDto | null> {
    const cachedData = await this.cacheService.get(
      ContactService.generateCacheId({ projectId, id }),
    );
    if (cachedData) {
      return plainToInstance(
        ContactDto,
        cachedData,
        DEFAULT_CLASS_TRANFORM_OPTIONS,
      );
    }

    const entry = await this.prisma.contact.findUnique({
      where: {
        id,
        projectId,
        deletedAt: null,
      },
    });
    const dto = plainToInstance(
      ContactDto,
      entry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    if (!!dto) {
      await this.cacheService.set(ContactService.generateCacheId(dto), dto);
    }

    return dto;
  }

  async findAll(
    context: Context,
    pageOptionsDto: PageOptionsDto,
    filters: Prisma.ContactWhereInput = {},
  ): Promise<PageDto<ContactDto>> {
    const [entries, total] = await Promise.all([
      this.prisma.contact.findMany({
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
      this.prisma.contact.count({
        where: {
          ...filters,
          deletedAt: null,
        },
      }),
    ]);

    const pageMetaDto = new PageMetaDto({ total, pageOptionsDto });

    return new PageDto(
      entries.map((entry) =>
        plainToInstance(ContactDto, entry, DEFAULT_CLASS_TRANFORM_OPTIONS),
      ),
      pageMetaDto,
    );
  }

  async create(
    context: Context,
    { projectId, ...input }: CreateContactDto,
  ): Promise<ContactDto> {
    const entry = await this.prisma.contact.create({
      data: {
        projectId,
        ...input,
        createdBy: input.createdBy as Prisma.InputJsonValue,
        updatedBy: input.createdBy as Prisma.InputJsonValue,
      },
    });
    const dto = plainToInstance(
      ContactDto,
      entry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.set(ContactService.generateCacheId(entry), dto);

    this.eventsService.emitEvent({
      projectId,
      entity: CustomerEntities.CONTACT,
      entityId: ContactService.generateEntityId(entry),
      eventName: CustomerEvents.CUSTOMER_CREATED,
      event: new ContactCreatedEvent(),
      action: EventAction.CREATE,
      after: dto,
    });

    return dto;
  }

  async update(
    context: Context,
    { id, projectId, updatedBy, ...data }: UpdateContactDto,
  ): Promise<ContactDto> {
    const entry = await this.findOneById(context, { projectId, id });
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.contact.update({
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
      ContactDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.set(ContactService.generateCacheId(dto), dto);

    this.eventsService.emitEvent({
      projectId,
      entity: CustomerEntities.CONTACT,
      entityId: ContactService.generateEntityId(updatedEntry),
      eventName: CustomerEvents.CUSTOMER_UPDATED,
      event: new ContactUpdatedEvent(),
      action: EventAction.UPDATE,
      before: entry,
      after: dto,
    });

    return dto;
  }

  async delete(context: Context, input: DeleteContactDto): Promise<ContactDto> {
    const { id, projectId, deletedBy } = input;

    const entry = await this.findOneById(context, { projectId, id });
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.contact.update({
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
      ContactDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.del(ContactService.generateCacheId(dto));

    this.eventsService.emitEvent({
      projectId,
      entity: CustomerEntities.CONTACT,
      entityId: ContactService.generateEntityId(updatedEntry),
      eventName: CustomerEvents.CUSTOMER_DELETED,
      event: new ContactDeletedEvent(),
      action: EventAction.DELETE,
      before: entry,
      after: dto,
    });

    return dto;
  }
}
