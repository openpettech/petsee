import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, AnimalRelationship } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

import {
  CreateAnimalRelationshipDto,
  UpdateAnimalRelationshipDto,
  DeleteAnimalRelationshipDto,
  AnimalRelationshipCreatedEvent,
  AnimalRelationshipUpdatedEvent,
  AnimalRelationshipDeletedEvent,
  AnimalEvents,
  AnimalRelationshipDto,
  AnimalEntities,
} from '@contracts/animal';
import {
  PageDto,
  PageMetaDto,
  PageOptionsDto,
  Context,
} from '@contracts/common';
import { EventAction } from '@contracts/events';
import { EventsService, CacheService, PrismaService } from '@modules/core';
import { DEFAULT_CLASS_TRANFORM_OPTIONS } from '@constants/class-transformer.constant';
import { createConnectObject } from '@utils/prisma';

interface GenerateCacheIdParams {
  projectId: string;
  id: string;
}

interface FindOneByIdParams {
  projectId: string;
  id: string;
}

@Injectable()
export class AnimalRelationshipService {
  private readonly logger = new Logger(AnimalRelationshipService.name);

  static generateCacheId({ projectId, id }: GenerateCacheIdParams) {
    return `Project-${projectId}/AnimalRelationship-${id}/ID`;
  }

  static generateEntityId(entry: AnimalRelationship) {
    return `Project-${entry.projectId}/AnimalRelationship-${entry.id}/ID`;
  }

  constructor(
    private readonly cacheService: CacheService<AnimalRelationshipDto>,
    private readonly prisma: PrismaService,
    private readonly eventsService: EventsService<AnimalRelationshipDto>,
  ) {}

  async findOneById(
    context: Context,
    { projectId, id }: FindOneByIdParams,
  ): Promise<AnimalRelationshipDto | null> {
    const cachedData = await this.cacheService.get(
      AnimalRelationshipService.generateCacheId({
        projectId,
        id,
      }),
    );
    if (cachedData) {
      return plainToInstance(
        AnimalRelationshipDto,
        cachedData,
        DEFAULT_CLASS_TRANFORM_OPTIONS,
      );
    }

    const entry = await this.prisma.animalRelationship.findUnique({
      where: {
        id,
        projectId,
        deletedAt: null,
      },
    });
    const dto = plainToInstance(
      AnimalRelationshipDto,
      entry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    if (!!dto) {
      await this.cacheService.set(
        AnimalRelationshipService.generateCacheId({
          projectId,
          id,
        }),
        dto,
      );
    }

    return dto;
  }

  async findAll(
    context: Context,
    pageOptionsDto: PageOptionsDto,
    filters: Prisma.AnimalRelationshipWhereInput = {},
  ): Promise<PageDto<AnimalRelationshipDto>> {
    const [entries, total] = await Promise.all([
      this.prisma.animalRelationship.findMany({
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
      this.prisma.animalRelationship.count({
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
          AnimalRelationshipDto,
          entry,
          DEFAULT_CLASS_TRANFORM_OPTIONS,
        ),
      ),
      pageMetaDto,
    );
  }

  async create(
    context: Context,
    { projectId, customerId, animalId, ...input }: CreateAnimalRelationshipDto,
  ): Promise<AnimalRelationshipDto> {
    const existingRelationship = await this.prisma.animalRelationship.findFirst(
      {
        where: {
          projectId,
          animalId: animalId,
          customerId: customerId,
        },
      },
    );
    if (!!existingRelationship) {
      throw new BadRequestException(
        'Animal Relationship for entities already exists',
      );
    }

    const entry = await this.prisma.animalRelationship.create({
      data: {
        project: createConnectObject(projectId),
        customer: createConnectObject(customerId),
        animal: createConnectObject(animalId),
        ...input,
        createdBy: input.createdBy as Prisma.InputJsonValue,
        updatedBy: input.createdBy as Prisma.InputJsonValue,
      },
    });
    const dto = plainToInstance(
      AnimalRelationshipDto,
      entry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.set(
      AnimalRelationshipService.generateCacheId(entry),
      dto,
    );

    this.eventsService.emitEvent({
      projectId,
      entity: AnimalEntities.ANIMAL_RELATIONSHIP,
      entityId: AnimalRelationshipService.generateEntityId(entry),
      eventName: AnimalEvents.ANIMAL_RELATIONSHIP_CREATED,
      event: new AnimalRelationshipCreatedEvent(),
      action: EventAction.CREATE,
      after: dto,
    });

    return dto;
  }

  async update(
    context: Context,
    { id, projectId, updatedBy, ...data }: UpdateAnimalRelationshipDto,
  ): Promise<AnimalRelationshipDto> {
    const entry = await this.findOneById(context, {
      projectId,
      id,
    });
    if (!entry) {
      throw new NotFoundException('Animal Relationship not found');
    }

    const updatedEntry = await this.prisma.animalRelationship.update({
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
      AnimalRelationshipDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.set(
      AnimalRelationshipService.generateCacheId({
        projectId,
        id,
      }),
      dto,
    );

    this.eventsService.emitEvent({
      projectId,
      entity: AnimalEntities.ANIMAL_RELATIONSHIP,
      entityId: AnimalRelationshipService.generateEntityId(updatedEntry),
      eventName: AnimalEvents.ANIMAL_RELATIONSHIP_UPDATED,
      event: new AnimalRelationshipUpdatedEvent(),
      action: EventAction.UPDATE,
      before: entry,
      after: dto,
    });

    return dto;
  }

  async delete(
    context: Context,
    input: DeleteAnimalRelationshipDto,
  ): Promise<AnimalRelationshipDto> {
    const { id, projectId, deletedBy } = input;

    const entry = await this.findOneById(context, {
      projectId,
      id,
    });
    if (!entry) {
      throw new NotFoundException('Animal Relationship not found');
    }

    const updatedEntry = await this.prisma.animalRelationship.update({
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
      AnimalRelationshipDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.del(
      AnimalRelationshipService.generateCacheId({
        projectId,
        id,
      }),
    );

    this.eventsService.emitEvent({
      projectId,
      entity: AnimalEntities.ANIMAL_RELATIONSHIP,
      entityId: AnimalRelationshipService.generateEntityId(updatedEntry),
      eventName: AnimalEvents.ANIMAL_RELATIONSHIP_DELETED,
      event: new AnimalRelationshipDeletedEvent(),
      action: EventAction.DELETE,
      before: entry,
      after: dto,
    });

    return dto;
  }
}
