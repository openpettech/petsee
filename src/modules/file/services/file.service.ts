import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma, File } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

import { EventsService, CacheService, PrismaService } from '@modules/core';
import {
  CreateFileDto,
  UpdateFileDto,
  DeleteFileDto,
  FileCreatedEvent,
  FileUpdatedEvent,
  FileDeletedEvent,
  FileEvents,
  FileDto,
  FileEntities,
} from '@contracts/file';
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
export class FileService {
  private readonly logger = new Logger(FileService.name);

  static generateCacheId({ projectId, id }: GenerateCacheIdParams) {
    return `Project-${projectId}/File-${id}/ID`;
  }

  static generateEntityId(entry: File) {
    return `Project-${entry.projectId}/File-${entry.id}`;
  }

  constructor(
    private readonly cacheService: CacheService<FileDto>,
    private readonly prisma: PrismaService,
    private readonly eventsService: EventsService<FileDto>,
  ) {}

  async findOneById(
    context: Context,
    { projectId, id }: FindOneByIdParams,
  ): Promise<FileDto | null> {
    const cachedData = await this.cacheService.get(
      FileService.generateCacheId({ projectId, id }),
    );
    if (cachedData) {
      return plainToInstance(
        FileDto,
        cachedData,
        DEFAULT_CLASS_TRANFORM_OPTIONS,
      );
    }

    const entry = await this.prisma.file.findUnique({
      where: {
        id,
        projectId,
        deletedAt: null,
      },
    });
    const dto = plainToInstance(FileDto, entry, DEFAULT_CLASS_TRANFORM_OPTIONS);

    if (!!dto) {
      await this.cacheService.set(FileService.generateCacheId(dto), dto);
    }

    return dto;
  }

  async findAll(
    context: Context,
    pageOptionsDto: PageOptionsDto,
    filters: Prisma.FileWhereInput = {},
  ): Promise<PageDto<FileDto>> {
    const [entries, total] = await Promise.all([
      this.prisma.file.findMany({
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
      this.prisma.file.count({
        where: {
          ...filters,
          deletedAt: null,
        },
      }),
    ]);

    const pageMetaDto = new PageMetaDto({ total, pageOptionsDto });

    return new PageDto(
      entries.map((entry) =>
        plainToInstance(FileDto, entry, DEFAULT_CLASS_TRANFORM_OPTIONS),
      ),
      pageMetaDto,
    );
  }

  async create(
    context: Context,
    { projectId, ...input }: CreateFileDto,
  ): Promise<FileDto> {
    const entry = await this.prisma.file.create({
      data: {
        ...input,
        projectId,
        createdBy: input.createdBy as Prisma.InputJsonValue,
        updatedBy: input.createdBy as Prisma.InputJsonValue,
      },
    });
    const dto = plainToInstance(FileDto, entry, DEFAULT_CLASS_TRANFORM_OPTIONS);

    await this.cacheService.set(FileService.generateCacheId(entry), dto);

    this.eventsService.emitEvent({
      projectId,
      entity: FileEntities.FILE,
      entityId: FileService.generateEntityId(entry),
      eventName: FileEvents.FILE_CREATED,
      event: new FileCreatedEvent(),
      action: EventAction.CREATE,
      after: dto,
    });

    return dto;
  }

  async update(
    context: Context,
    { id, projectId, updatedBy, ...data }: UpdateFileDto,
  ): Promise<FileDto> {
    const entry = await this.findOneById(context, { projectId, id });
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.file.update({
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
      FileDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.set(FileService.generateCacheId(dto), dto);

    this.eventsService.emitEvent({
      projectId,
      entity: FileEntities.FILE,
      entityId: FileService.generateEntityId(updatedEntry),
      eventName: FileEvents.FILE_UPDATED,
      event: new FileUpdatedEvent(),
      action: EventAction.UPDATE,
      before: entry,
      after: dto,
    });

    return dto;
  }

  async delete(context: Context, input: DeleteFileDto): Promise<FileDto> {
    const { id, projectId, deletedBy } = input;

    const entry = await this.findOneById(context, { projectId, id });
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.file.update({
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
      FileDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.del(FileService.generateCacheId(dto));

    this.eventsService.emitEvent({
      projectId,
      entity: FileEntities.FILE,
      entityId: FileService.generateEntityId(updatedEntry),
      eventName: FileEvents.FILE_DELETED,
      event: new FileDeletedEvent(),
      action: EventAction.DELETE,
      before: entry,
      after: dto,
    });

    return dto;
  }
}
