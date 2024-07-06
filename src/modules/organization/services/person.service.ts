import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma, Person } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

import { EventsService, CacheService, PrismaService } from '@modules/core';
import {
  CreatePersonDto,
  UpdatePersonDto,
  DeletePersonDto,
  PersonCreatedEvent,
  PersonUpdatedEvent,
  PersonDeletedEvent,
  OrganizationEvents,
  PersonDto,
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
export class PersonService {
  private readonly logger = new Logger(PersonService.name);

  static generateCacheId({ projectId, id }: GenerateCacheIdParams) {
    return `Project-${projectId}/Person-${id}/ID`;
  }

  static generateEntityId(entry: Person) {
    return `Project-${entry.projectId}/Person-${entry.id}`;
  }

  constructor(
    private readonly cacheService: CacheService<PersonDto>,
    private readonly prisma: PrismaService,
    private readonly eventsService: EventsService<PersonDto>,
  ) {}

  async findOneById(
    context: Context,
    { projectId, id }: FindOneByIdParams,
  ): Promise<PersonDto | null> {
    const cachedData = await this.cacheService.get(
      PersonService.generateCacheId({ projectId, id }),
    );
    if (cachedData) {
      return plainToInstance(
        PersonDto,
        cachedData,
        DEFAULT_CLASS_TRANFORM_OPTIONS,
      );
    }

    const entry = await this.prisma.person.findUnique({
      where: {
        id,
        projectId,
        deletedAt: null,
      },
    });
    const dto = plainToInstance(
      PersonDto,
      entry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    if (!!dto) {
      await this.cacheService.set(PersonService.generateCacheId(dto), dto);
    }

    return dto;
  }

  async findAll(
    context: Context,
    pageOptionsDto: PageOptionsDto,
    filters: Prisma.PersonWhereInput = {},
  ): Promise<PageDto<PersonDto>> {
    const [entries, total] = await Promise.all([
      this.prisma.person.findMany({
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
      this.prisma.person.count({
        where: {
          ...filters,
          deletedAt: null,
        },
      }),
    ]);

    const pageMetaDto = new PageMetaDto({ total, pageOptionsDto });

    return new PageDto(
      entries.map((entry) =>
        plainToInstance(PersonDto, entry, DEFAULT_CLASS_TRANFORM_OPTIONS),
      ),
      pageMetaDto,
    );
  }

  async create(
    context: Context,
    { projectId, ...input }: CreatePersonDto,
  ): Promise<PersonDto> {
    const entry = await this.prisma.person.create({
      data: {
        ...input,
        projectId,
        createdBy: input.createdBy as Prisma.InputJsonValue,
        updatedBy: input.createdBy as Prisma.InputJsonValue,
      },
    });
    const dto = plainToInstance(
      PersonDto,
      entry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.set(PersonService.generateCacheId(entry), dto);

    this.eventsService.emitEvent({
      projectId,
      entity: OrganizationEntities.PERSON,
      entityId: PersonService.generateEntityId(entry),
      eventName: OrganizationEvents.PERSON_CREATED,
      event: new PersonCreatedEvent(),
      action: EventAction.CREATE,
      after: dto,
    });

    return dto;
  }

  async update(
    context: Context,
    { id, projectId, updatedBy, ...data }: UpdatePersonDto,
  ): Promise<PersonDto> {
    const entry = await this.findOneById(context, { projectId, id });
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.person.update({
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
      PersonDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.set(PersonService.generateCacheId(dto), dto);

    this.eventsService.emitEvent({
      projectId,
      entity: OrganizationEntities.PERSON,
      entityId: PersonService.generateEntityId(updatedEntry),
      eventName: OrganizationEvents.PERSON_UPDATED,
      event: new PersonUpdatedEvent(),
      action: EventAction.UPDATE,
      before: entry,
      after: dto,
    });

    return dto;
  }

  async delete(context: Context, input: DeletePersonDto): Promise<PersonDto> {
    const { id, projectId, deletedBy } = input;

    const entry = await this.findOneById(context, { projectId, id });
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.person.update({
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
      PersonDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.del(PersonService.generateCacheId(dto));

    this.eventsService.emitEvent({
      projectId,
      entity: OrganizationEntities.PERSON,
      entityId: PersonService.generateEntityId(updatedEntry),
      eventName: OrganizationEvents.PERSON_DELETED,
      event: new PersonDeletedEvent(),
      action: EventAction.DELETE,
      before: entry,
      after: dto,
    });

    return dto;
  }
}
