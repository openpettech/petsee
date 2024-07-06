import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma, Animal, TagType } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

import {
  CreateAnimalDto,
  UpdateAnimalDto,
  DeleteAnimalDto,
  AnimalCreatedEvent,
  AnimalUpdatedEvent,
  AnimalDeletedEvent,
  AnimalEvents,
  AnimalDto,
  AnimalEntities,
} from '@contracts/animal';
import {
  PageDto,
  PageMetaDto,
  PageOptionsDto,
  Context,
} from '@contracts/common';
import { EventAction } from '@contracts/events';
import { DEFAULT_CLASS_TRANFORM_OPTIONS } from '@constants/class-transformer.constant';
import { EventsService, CacheService, PrismaService } from '@modules/core';

import { createConnectObject, createConnectArrayObject } from '@utils/prisma';

interface GenerateCacheIdParams {
  projectId: string;
  id: string;
}

interface FindOneByIdParams {
  projectId: string;
  id: string;
}

@Injectable()
export class AnimalService {
  private readonly logger = new Logger(AnimalService.name);

  static generateCacheId({ projectId, id }: GenerateCacheIdParams) {
    return `Project-${projectId}/Animal-${id}/ID`;
  }

  static generateEntityId(entry: Animal) {
    return `Project-${entry.projectId}/Animal-${entry.id}`;
  }

  constructor(
    private readonly cacheService: CacheService<AnimalDto>,
    private readonly prisma: PrismaService,
    private readonly eventsService: EventsService<AnimalDto>,
  ) {}

  async findOneById(
    context: Context,
    { projectId, id }: FindOneByIdParams,
  ): Promise<AnimalDto | null> {
    const cachedData = await this.cacheService.get(
      AnimalService.generateCacheId({ projectId, id }),
    );
    if (cachedData) {
      return plainToInstance(
        AnimalDto,
        cachedData,
        DEFAULT_CLASS_TRANFORM_OPTIONS,
      );
    }

    const entry = await this.prisma.animal.findUnique({
      where: {
        id,
        projectId,
        deletedAt: null,
      },
    });
    const dto = plainToInstance(
      AnimalDto,
      entry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    if (!!dto) {
      await this.cacheService.set(
        AnimalService.generateCacheId({ projectId, id }),
        dto,
      );
    }

    return dto;
  }

  async findAll(
    context: Context,
    projectId: string,
    pageOptionsDto: PageOptionsDto,
    filters: Prisma.AnimalWhereInput = {},
  ): Promise<PageDto<AnimalDto>> {
    const [entries, total] = await Promise.all([
      this.prisma.animal.findMany({
        take: pageOptionsDto.limit,
        skip: pageOptionsDto.offset,
        orderBy: {
          createdAt: pageOptionsDto.order,
        },
        where: {
          ...filters,
          projectId,
          deletedAt: null,
        },
      }),
      this.prisma.animal.count({
        where: {
          ...filters,
          projectId,
          deletedAt: null,
        },
      }),
    ]);

    const pageMetaDto = new PageMetaDto({ total, pageOptionsDto });

    return new PageDto(
      entries.map((entry) =>
        plainToInstance(AnimalDto, entry, DEFAULT_CLASS_TRANFORM_OPTIONS),
      ),
      pageMetaDto,
    );
  }

  async create(
    context: Context,
    {
      projectId,
      tagIds,
      allergenIds,
      speciesId,
      breedId,
      crossbreedId,
      bloodGroupId,
      ...input
    }: CreateAnimalDto,
  ): Promise<AnimalDto> {
    const entry = await this.prisma.animal.create({
      data: {
        ...input,
        createdBy: input.createdBy as Prisma.InputJsonValue,
        updatedBy: input.createdBy as Prisma.InputJsonValue,
        project: createConnectObject(projectId),
        species: createConnectObject(speciesId),
        breed: createConnectObject(breedId),
        crossbreed: createConnectObject(crossbreedId),
        bloodGroup: createConnectObject(bloodGroupId),
        tags: createConnectArrayObject(tagIds, {
          projectId,
          type: TagType.ANIMAL,
        }),
        allergies: createConnectArrayObject(allergenIds),
      },
    });

    const dto = plainToInstance(
      AnimalDto,
      entry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.set(AnimalService.generateCacheId(entry), dto);

    this.eventsService.emitEvent({
      projectId,
      entity: AnimalEntities.ANIMAL,
      entityId: AnimalService.generateEntityId(entry),
      eventName: AnimalEvents.ANIMAL_CREATED,
      event: new AnimalCreatedEvent(),
      action: EventAction.CREATE,
      after: dto,
    });

    return dto;
  }

  async update(
    context: Context,
    {
      id,
      projectId,
      tagIds,
      allergenIds,
      speciesId,
      breedId,
      crossbreedId,
      bloodGroupId,
      updatedBy,
      ...data
    }: UpdateAnimalDto,
  ): Promise<AnimalDto> {
    const entry = await this.findOneById(context, { projectId, id });
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.animal.update({
      where: {
        id,
        projectId,
        deletedAt: null,
      },
      data: {
        updatedBy: updatedBy as Prisma.InputJsonValue,
        project: createConnectObject(projectId),
        species: createConnectObject(speciesId),
        breed: createConnectObject(breedId),
        crossbreed: createConnectObject(crossbreedId),
        bloodGroup: createConnectObject(bloodGroupId),
        tags: createConnectArrayObject(tagIds, {
          projectId,
          type: TagType.ANIMAL,
        }),
        allergies: createConnectArrayObject(allergenIds),
        ...data,
      },
    });
    const dto = plainToInstance(
      AnimalDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.set(
      AnimalService.generateCacheId({ projectId, id }),
      dto,
    );

    this.eventsService.emitEvent({
      projectId,
      entity: AnimalEntities.ANIMAL,
      entityId: AnimalService.generateEntityId(updatedEntry),
      eventName: AnimalEvents.ANIMAL_UPDATED,
      event: new AnimalUpdatedEvent(),
      action: EventAction.UPDATE,
      before: entry,
      after: dto,
    });

    return dto;
  }

  async delete(context: Context, input: DeleteAnimalDto): Promise<AnimalDto> {
    const { id, projectId, deletedBy } = input;

    const entry = await this.findOneById(context, { projectId, id });
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.animal.update({
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
    const dto = plainToInstance(AnimalDto, updatedEntry, {
      excludeExtraneousValues: true,
      exposeDefaultValues: true,
    });

    await this.cacheService.del(
      AnimalService.generateCacheId({ projectId, id }),
    );

    this.eventsService.emitEvent({
      projectId,
      entity: AnimalEntities.ANIMAL,
      entityId: AnimalService.generateEntityId(updatedEntry),
      eventName: AnimalEvents.ANIMAL_DELETED,
      event: new AnimalDeletedEvent(),
      action: EventAction.DELETE,
      before: entry,
      after: dto,
    });

    return dto;
  }
}
