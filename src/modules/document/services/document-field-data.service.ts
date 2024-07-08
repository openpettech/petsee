import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma, DocumentFieldData } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

import { EventsService, CacheService, PrismaService } from '@modules/core';
import {
  CreateDocumentFieldDataDto,
  UpdateDocumentFieldDataDto,
  DeleteDocumentFieldDataDto,
  DocumentFieldDataCreatedEvent,
  DocumentFieldDataUpdatedEvent,
  DocumentFieldDataDeletedEvent,
  DocumentFieldDataDto,
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
export class DocumentFieldDataService {
  private readonly logger = new Logger(DocumentFieldDataService.name);

  static generateCacheId({ projectId, id }: GenerateCacheIdParams) {
    return `Project-${projectId}/DocumentFieldData-${id}/ID`;
  }

  static generateEntityId(entry: DocumentFieldData) {
    return `Project-${entry.projectId}/DocumentFieldData-${entry.id}`;
  }

  constructor(
    private readonly cacheService: CacheService<DocumentFieldDataDto>,
    private readonly prisma: PrismaService,
    private readonly eventsService: EventsService<DocumentFieldDataDto>,
  ) {}

  async findOneById(
    context: Context,
    { projectId, id }: FindOneByIdParams,
  ): Promise<DocumentFieldDataDto | null> {
    const cachedData = await this.cacheService.get(
      DocumentFieldDataService.generateCacheId({ projectId, id }),
    );
    if (cachedData) {
      return plainToInstance(
        DocumentFieldDataDto,
        cachedData,
        DEFAULT_CLASS_TRANFORM_OPTIONS,
      );
    }

    const entry = await this.prisma.documentFieldData.findUnique({
      where: {
        id,
        projectId,
        deletedAt: null,
      },
    });
    const dto = plainToInstance(
      DocumentFieldDataDto,
      entry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    if (!!dto) {
      await this.cacheService.set(
        DocumentFieldDataService.generateCacheId(dto),
        dto,
      );
    }

    return dto;
  }

  async findAll(
    context: Context,
    pageOptionsDto: PageOptionsDto,
    filters: Prisma.DocumentFieldDataWhereInput = {},
  ): Promise<PageDto<DocumentFieldDataDto>> {
    const [entries, total] = await Promise.all([
      this.prisma.documentFieldData.findMany({
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
      this.prisma.documentFieldData.count({
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
          DocumentFieldDataDto,
          entry,
          DEFAULT_CLASS_TRANFORM_OPTIONS,
        ),
      ),
      pageMetaDto,
    );
  }

  async create(
    context: Context,
    {
      projectId,
      documentId,
      documentTemplateFieldId,
      ...input
    }: CreateDocumentFieldDataDto,
  ): Promise<DocumentFieldDataDto> {
    const entry = await this.prisma.documentFieldData.create({
      data: {
        ...input,
        project: createConnectObject(projectId),
        document: createConnectObject(documentId),
        documentTemplateField: createConnectObject(documentTemplateFieldId),
        createdBy: input.createdBy as Prisma.InputJsonValue,
        updatedBy: input.createdBy as Prisma.InputJsonValue,
      },
    });
    const dto = plainToInstance(
      DocumentFieldDataDto,
      entry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.set(
      DocumentFieldDataService.generateCacheId(entry),
      dto,
    );

    this.eventsService.emitEvent({
      projectId,
      entity: DocumentEntities.DOCUMENT_FIELD_DATA,
      entityId: DocumentFieldDataService.generateEntityId(entry),
      eventName: DocumentEvents.DOCUMENT_FIELD_DATA_CREATED,
      event: new DocumentFieldDataCreatedEvent(),
      action: EventAction.CREATE,
      after: dto,
    });

    return dto;
  }

  async update(
    context: Context,
    { id, projectId, updatedBy, ...data }: UpdateDocumentFieldDataDto,
  ): Promise<DocumentFieldDataDto> {
    const entry = await this.findOneById(context, { projectId, id });
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.documentFieldData.update({
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
      DocumentFieldDataDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.set(
      DocumentFieldDataService.generateCacheId(dto),
      dto,
    );

    this.eventsService.emitEvent({
      projectId,
      entity: DocumentEntities.DOCUMENT_FIELD_DATA,
      entityId: DocumentFieldDataService.generateEntityId(updatedEntry),
      eventName: DocumentEvents.DOCUMENT_FIELD_DATA_UPDATED,
      event: new DocumentFieldDataUpdatedEvent(),
      action: EventAction.UPDATE,
      before: entry,
      after: dto,
    });

    return dto;
  }

  async delete(
    context: Context,
    input: DeleteDocumentFieldDataDto,
  ): Promise<DocumentFieldDataDto> {
    const { id, projectId, deletedBy } = input;

    const entry = await this.findOneById(context, { projectId, id });
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.documentFieldData.update({
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
      DocumentFieldDataDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.del(DocumentFieldDataService.generateCacheId(dto));

    this.eventsService.emitEvent({
      projectId,
      entity: DocumentEntities.DOCUMENT_FIELD_DATA,
      entityId: DocumentFieldDataService.generateEntityId(updatedEntry),
      eventName: DocumentEvents.DOCUMENT_FIELD_DATA_DELETED,
      event: new DocumentFieldDataDeletedEvent(),
      action: EventAction.DELETE,
      before: entry,
      after: dto,
    });

    return dto;
  }
}
