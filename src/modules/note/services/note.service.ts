import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma, Note } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

import { EventsService, CacheService, PrismaService } from '@modules/core';
import {
  CreateNoteDto,
  UpdateNoteDto,
  DeleteNoteDto,
  NoteCreatedEvent,
  NoteUpdatedEvent,
  NoteDeletedEvent,
  NoteEvents,
  NoteDto,
  NoteEntities,
} from '@contracts/note';
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
export class NoteService {
  private readonly logger = new Logger(NoteService.name);

  static generateCacheId({ projectId, id }: GenerateCacheIdParams) {
    return `Project-${projectId}/Note-${id}/ID`;
  }

  static generateEntityId(entry: Note) {
    return `Project-${entry.projectId}/Note-${entry.id}`;
  }

  constructor(
    private readonly cacheService: CacheService<NoteDto>,
    private readonly prisma: PrismaService,
    private readonly eventsService: EventsService<NoteDto>,
  ) {}

  async findOneById(
    context: Context,
    { projectId, id }: FindOneByIdParams,
  ): Promise<NoteDto | null> {
    const cachedData = await this.cacheService.get(
      NoteService.generateCacheId({ projectId, id }),
    );
    if (cachedData) {
      return plainToInstance(
        NoteDto,
        cachedData,
        DEFAULT_CLASS_TRANFORM_OPTIONS,
      );
    }

    const entry = await this.prisma.note.findUnique({
      where: {
        id,
        projectId,
        deletedAt: null,
      },
    });
    const dto = plainToInstance(NoteDto, entry, DEFAULT_CLASS_TRANFORM_OPTIONS);

    if (!!dto) {
      await this.cacheService.set(NoteService.generateCacheId(dto), dto);
    }

    return dto;
  }

  async findAll(
    context: Context,
    pageOptionsDto: PageOptionsDto,
    filters: Prisma.NoteWhereInput = {},
  ): Promise<PageDto<NoteDto>> {
    const [entries, total] = await Promise.all([
      this.prisma.note.findMany({
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
      this.prisma.note.count({
        where: {
          ...filters,
          deletedAt: null,
        },
      }),
    ]);

    const pageMetaDto = new PageMetaDto({ total, pageOptionsDto });

    return new PageDto(
      entries.map((entry) =>
        plainToInstance(NoteDto, entry, DEFAULT_CLASS_TRANFORM_OPTIONS),
      ),
      pageMetaDto,
    );
  }

  async create(
    context: Context,
    { projectId, ...input }: CreateNoteDto,
  ): Promise<NoteDto> {
    const entry = await this.prisma.note.create({
      data: {
        ...input,
        projectId,
        createdBy: input.createdBy as Prisma.InputJsonValue,
        updatedBy: input.createdBy as Prisma.InputJsonValue,
      },
    });
    const dto = plainToInstance(NoteDto, entry, DEFAULT_CLASS_TRANFORM_OPTIONS);

    await this.cacheService.set(NoteService.generateCacheId(entry), dto);

    this.eventsService.emitEvent({
      projectId,
      entity: NoteEntities.NOTE,
      entityId: NoteService.generateEntityId(entry),
      eventName: NoteEvents.NOTE_CREATED,
      event: new NoteCreatedEvent(),
      action: EventAction.CREATE,
      after: dto,
    });

    return dto;
  }

  async update(
    context: Context,
    { id, projectId, updatedBy, ...data }: UpdateNoteDto,
  ): Promise<NoteDto> {
    const entry = await this.findOneById(context, { projectId, id });
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.note.update({
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
      NoteDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.set(NoteService.generateCacheId(dto), dto);

    this.eventsService.emitEvent({
      projectId,
      entity: NoteEntities.NOTE,
      entityId: NoteService.generateEntityId(updatedEntry),
      eventName: NoteEvents.NOTE_UPDATED,
      event: new NoteUpdatedEvent(),
      action: EventAction.UPDATE,
      before: entry,
      after: dto,
    });

    return dto;
  }

  async delete(context: Context, input: DeleteNoteDto): Promise<NoteDto> {
    const { id, projectId, deletedBy } = input;

    const entry = await this.findOneById(context, { projectId, id });
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.note.update({
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
      NoteDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.del(NoteService.generateCacheId(dto));

    this.eventsService.emitEvent({
      projectId,
      entity: NoteEntities.NOTE,
      entityId: NoteService.generateEntityId(updatedEntry),
      eventName: NoteEvents.NOTE_DELETED,
      event: new NoteDeletedEvent(),
      action: EventAction.DELETE,
      before: entry,
      after: dto,
    });

    return dto;
  }
}
