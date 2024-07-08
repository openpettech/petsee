import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma, Document } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

import { EventsService, CacheService, PrismaService } from '@modules/core';
import {
  CreateDocumentDto,
  UpdateDocumentDto,
  DeleteDocumentDto,
  DocumentCreatedEvent,
  DocumentUpdatedEvent,
  DocumentDeletedEvent,
  DocumentDto,
  DocumentEvents,
  DocumentEntities,
} from '@contracts/document';
import {
  PageDto,
  PageMetaDto,
  PageOptionsDto,
  Context,
} from '@contracts/common';
import { EventAction } from '@contracts/events';
import { DEFAULT_CLASS_TRANFORM_OPTIONS } from '@constants/class-transformer.constant';
import { createConnectObject } from '@utils/prisma';

type GenerateCacheIdParams = {
  projectId: string;
  id: string;
};

type FindOneByIdParams = {
  projectId: string;
  id: string;
};

@Injectable()
export class DocumentService {
  private readonly logger = new Logger(DocumentService.name);

  static generateCacheId({ projectId, id }: GenerateCacheIdParams) {
    return `Project-${projectId}/Document-${id}/ID`;
  }

  static generateEntityId(entry: Document) {
    return `Project-${entry.projectId}/Document-${entry.id}`;
  }

  constructor(
    private readonly cacheService: CacheService<DocumentDto>,
    private readonly prisma: PrismaService,
    private readonly eventsService: EventsService<DocumentDto>,
  ) {}

  async findOneById(
    context: Context,
    { projectId, id }: FindOneByIdParams,
  ): Promise<DocumentDto | null> {
    const cachedData = await this.cacheService.get(
      DocumentService.generateCacheId({ projectId, id }),
    );
    if (cachedData) {
      return plainToInstance(
        DocumentDto,
        cachedData,
        DEFAULT_CLASS_TRANFORM_OPTIONS,
      );
    }

    const entry = await this.prisma.document.findUnique({
      where: {
        id,
        projectId,
        deletedAt: null,
      },
    });
    const dto = plainToInstance(
      DocumentDto,
      entry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    if (!!dto) {
      await this.cacheService.set(DocumentService.generateCacheId(dto), dto);
    }

    return dto;
  }

  async findAll(
    context: Context,
    pageOptionsDto: PageOptionsDto,
    filters: Prisma.DocumentWhereInput = {},
  ): Promise<PageDto<DocumentDto>> {
    const [entries, total] = await Promise.all([
      this.prisma.document.findMany({
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
      this.prisma.document.count({
        where: {
          ...filters,
          deletedAt: null,
        },
      }),
    ]);

    const pageMetaDto = new PageMetaDto({ total, pageOptionsDto });

    return new PageDto(
      entries.map((entry) =>
        plainToInstance(DocumentDto, entry, DEFAULT_CLASS_TRANFORM_OPTIONS),
      ),
      pageMetaDto,
    );
  }

  async create(
    context: Context,
    { projectId, documentTemplateId, ...input }: CreateDocumentDto,
  ): Promise<DocumentDto> {
    const entry = await this.prisma.document.create({
      data: {
        ...input,
        project: createConnectObject(projectId),
        template: createConnectObject(documentTemplateId),
        createdBy: input.createdBy as Prisma.InputJsonValue,
        updatedBy: input.createdBy as Prisma.InputJsonValue,
      },
    });
    const dto = plainToInstance(
      DocumentDto,
      entry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.set(DocumentService.generateCacheId(entry), dto);

    this.eventsService.emitEvent({
      projectId,
      entity: DocumentEntities.DOCUMENT,
      entityId: DocumentService.generateEntityId(entry),
      eventName: DocumentEvents.DOCUMENT_CREATED,
      event: new DocumentCreatedEvent(),
      action: EventAction.CREATE,
      after: dto,
    });

    return dto;
  }

  async update(
    context: Context,
    { id, projectId, updatedBy, ...data }: UpdateDocumentDto,
  ): Promise<DocumentDto> {
    const entry = await this.findOneById(context, { projectId, id });
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.document.update({
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
      DocumentDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.set(DocumentService.generateCacheId(dto), dto);

    this.eventsService.emitEvent({
      projectId,
      entity: DocumentEntities.DOCUMENT,
      entityId: DocumentService.generateEntityId(updatedEntry),
      eventName: DocumentEvents.DOCUMENT_UPDATED,
      event: new DocumentUpdatedEvent(),
      action: EventAction.UPDATE,
      before: entry,
      after: dto,
    });

    return dto;
  }

  async delete(
    context: Context,
    input: DeleteDocumentDto,
  ): Promise<DocumentDto> {
    const { id, projectId, deletedBy } = input;

    const entry = await this.findOneById(context, { projectId, id });
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.document.update({
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
      DocumentDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.del(DocumentService.generateCacheId(dto));

    this.eventsService.emitEvent({
      projectId,
      entity: DocumentEntities.DOCUMENT,
      entityId: DocumentService.generateEntityId(updatedEntry),
      eventName: DocumentEvents.DOCUMENT_DELETED,
      event: new DocumentDeletedEvent(),
      action: EventAction.DELETE,
      before: entry,
      after: dto,
    });

    return dto;
  }
}
